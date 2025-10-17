'use client';

import React from 'react';
import {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import { CalendarIcon } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  subWeeks,
  subMonths,
} from 'date-fns';
import DataTable from './components/data-table';
import { exportTableData } from '@/utils/tableExport';

interface TableSection<T> {
  title: string;
  data: T[];
  columns: ColumnDef<T, any>[];
}

interface ReportTemplateProps<T> {
  title: string;
  sections: TableSection<T>[];
  showCheckbox?: boolean;
  onDateRangeChange?: (startDate: Date, endDate: Date) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
  exportFileName?: string; // New prop for custom export filename
  transformExportData?: (data: T[]) => any[]; // New prop for data transformation before export
}

type QuickFilterOption =
  | 'Today'
  | 'Yesterday'
  | 'Last Week'
  | 'Last Month'
  | 'Custom';

export default function ReportTemplate<T>({
  title,
  sections,
  showCheckbox = true,
  onDateRangeChange,
  initialStartDate = new Date(new Date().setMonth(new Date().getMonth() - 1)),
  initialEndDate = new Date(),
  exportFileName,
  transformExportData,
}: ReportTemplateProps<T>) {
  const [startDate, setStartDate] = React.useState<Date | null>(
    initialStartDate
  );
  const [endDate, setEndDate] = React.useState<Date | null>(initialEndDate);
  const [activeFilter, setActiveFilter] =
    React.useState<QuickFilterOption>('Custom');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const handleQuickFilter = (filter: QuickFilterOption) => {
    setActiveFilter(filter);
    const today = new Date();

    let newStartDate: Date;
    let newEndDate: Date;

    switch (filter) {
      case 'Today':
        newStartDate = startOfDay(today);
        newEndDate = endOfDay(today);
        break;
      case 'Yesterday':
        newStartDate = startOfDay(subDays(today, 1));
        newEndDate = endOfDay(subDays(today, 1));
        break;
      case 'Last Week':
        newStartDate = startOfDay(subWeeks(today, 1));
        newEndDate = endOfDay(today);
        break;
      case 'Last Month':
        newStartDate = startOfDay(subMonths(today, 1));
        newEndDate = endOfDay(today);
        break;
      default:
        return;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);

    if (onDateRangeChange) {
      onDateRangeChange(newStartDate, newEndDate);
    }
  };

  const handleDateChange = (type: 'start' | 'end', date: Date | undefined) => {
    const newDate = date || null;

    if (type === 'start') {
      setStartDate(newDate);
    } else {
      setEndDate(newDate);
    }
    setActiveFilter('Custom');
  };

  const handleSearch = () => {
    if (startDate && endDate) {
      setActiveFilter('Custom');

      if (onDateRangeChange) {
        onDateRangeChange(startDate, endDate);
      }
    }
  };

  const validSections = sections.filter(
    (section): section is TableSection<T> => section !== undefined
  );

  const handleExport = () => {
    // Get selected rows if any are selected
    const selectedIndices = Object.keys(rowSelection)
      .filter((index) => rowSelection[index])
      .map(Number);

    // Get data from all sections
    let dataToExport: any[] = [];

    if (selectedIndices.length > 0) {
      // Export only selected rows
      sections.forEach((section) => {
        const sectionSelectedData = selectedIndices
          .map((index) => section.data[index])
          .filter(Boolean); // Remove any undefined entries
        dataToExport = [...dataToExport, ...sectionSelectedData];
      });
    } else {
      // Export all data when nothing is selected
      dataToExport = sections.flatMap((section) => section.data);
    }

    // Apply transformation if provided
    if (transformExportData) {
      dataToExport = transformExportData(dataToExport);
    }

    // Generate filename with date range
    const dateRangeStr =
      startDate && endDate
        ? `_${format(startDate, 'yyyy-MM-dd')}_to_${format(endDate, 'yyyy-MM-dd')}`
        : '';

    const filename =
      exportFileName ||
      `${title.toLowerCase().replace(/\s+/g, '_')}${dateRangeStr}`;

    // Export the data
    exportTableData({
      data: dataToExport,
      filename,
      sheetName: title,
      format: 'xlsx',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="border-b border-border space-y-6">
        <h2 className="text-lg">{title}</h2>
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:items-end">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
            <div className="space-y-1 flex flex-col w-full md:w-auto">
              <label className="text-sm">Filter Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full md:w-[240px] justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate || undefined}
                    onSelect={(day) => handleDateChange('start', day)}
                    disabled={(date) => (endDate ? date > endDate : false)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1 flex flex-col w-full md:w-auto">
              <label className="text-sm">Filter End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full md:w-[240px] justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate || undefined}
                    onSelect={(day) => handleDateChange('end', day)}
                    disabled={(date) => (startDate ? date < startDate : false)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button
              className="w-full md:w-auto bg-[hsl(var(--gradient-purple-start))] hover:bg-[hsl(var(--gradient-purple-end))] text-destructive-foreground shadow-md"
              onClick={handleSearch}
              disabled={!startDate || !endDate}
            >
              Search
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                'Today',
                'Yesterday',
                'Last Week',
                'Last Month',
                'Custom',
              ] as const
            ).map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? 'default' : 'outline'}
                onClick={() => handleQuickFilter(filter)}
                className={cn(
                  'px-4 py-2',
                  activeFilter === filter &&
                    'bg-[hsl(var(--gradient-purple-start))] hover:bg-[hsl(var(--gradient-purple-end))] text-white'
                )}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 py-6 space-y-6">
        <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-4 md:items-center px-6">
          <Button
            className="w-full md:w-auto bg-[hsl(var(--gradient-purple-start))] hover:bg-[hsl(var(--gradient-purple-end))] text-destructive-foreground shadow-md"
            onClick={handleExport}
          >
            Export xlsx
          </Button>
          <input
            type="text"
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-border rounded-md bg-card"
          />
        </div>
        {validSections.map((section) => (
          <DataTable
            key={section.title}
            data={section.data}
            columns={section.columns}
            title={section.title}
            showCheckbox={showCheckbox}
            sorting={sorting}
            setSorting={setSorting}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            pagination={pagination}
            setPagination={setPagination}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        ))}
      </CardContent>
    </Card>
  );
}
