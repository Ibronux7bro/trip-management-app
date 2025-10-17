'use client';

import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Filter, Search, RefreshCw, UserPlus } from 'lucide-react';
import { EnhancedDriver, DriverStatus } from '@/types';
import { columns } from './columns-def';
import { exportTableData } from '@/utils/tableExport';
import { getTodayDate } from '@/utils/getTodayDate';

interface DriverTableProps {
  data: EnhancedDriver[];
  onDriverSelect: (driverId: number) => void;
  statusFilters?: DriverStatus[];
  searchTerm?: string;
}

const STATUS_OPTIONS: DriverStatus[] = [
  'on-trip',
  'available',
  'offline',
  'active',
];

export const DriverTableContainer: React.FC<DriverTableProps> = ({
  data,
  onDriverSelect,
  statusFilters = [],
  searchTerm: initialSearchTerm = '',
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(initialSearchTerm);
  const [selectedStatus, setSelectedStatus] = useState<DriverStatus | null>(
    null
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    if (statusFilters.length > 0) {
      setColumnFilters((prev) => {
        const newFilters = prev.filter((filter) => filter.id !== 'status');
        return [...newFilters, { id: 'status', value: statusFilters }];
      });
    } else {
      setColumnFilters((prev) =>
        prev.filter((filter) => filter.id !== 'status')
      );
    }
  }, [statusFilters]);

  useEffect(() => {
    if (localSearchTerm) {
      setColumnFilters((prev) => {
        const newFilters = prev.filter((filter) => filter.id !== 'fullname');
        return [...newFilters, { id: 'fullname', value: localSearchTerm }];
      });
    } else {
      setColumnFilters((prev) =>
        prev.filter((filter) => filter.id !== 'fullname')
      );
    }
  }, [localSearchTerm]);

  const handleReset = () => {
    setLocalSearchTerm('');
    setSelectedStatus(null);
    setColumnFilters([]);
  };

  return (
    <Card className="w-full rounded-md">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Table Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search drivers..."
                  className="pl-8 w-full md:w-[250px] bg-card border-border"
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-card border-border">
                    <Filter className="mr-2 h-4 w-4" />
                    {selectedStatus || 'Select Status'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[200px] bg-card"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={
                        selectedStatus === status
                          ? 'font-semibold text-destructive-foreground bg-[hsl(var(--gradient-purple-start))] hover:bg-[hsl(var(--gradient-purple-end))] shadow-xl'
                          : ''
                      }
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full md:w-auto bg-[hsl(var(--gradient-purple-start))] hover:bg-[hsl(var(--gradient-purple-end))] text-destructive-foreground shadow-md"
              >
                <RefreshCw className="h-4 w-4 text-destructive-foreground" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-card border-border">
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                className="w-full md:w-auto bg-[hsl(var(--gradient-purple-start))] hover:bg-[hsl(var(--gradient-purple-end))] text-destructive-foreground shadow-md"
                onClick={() => {
                  const selectedRowIndices = Object.keys(rowSelection)
                    .map(Number)
                    .filter((index) => rowSelection[index]);

                  const dataToExport =
                    selectedRowIndices.length > 0
                      ? selectedRowIndices.map((index) => data[index])
                      : data;

                  const customFormat = getTodayDate('MM/DD/YYYY');
                  const file_name = `driversData-${customFormat}`;

                  exportTableData({
                    data: dataToExport,
                    filename: file_name,
                    sheetName: 'Drivers',
                    format: 'xlsx',
                  });
                }}
              >
                Export
              </Button>
              <Button className="w-full md:w-auto bg-[hsl(var(--gradient-purple-start))] hover:bg-[hsl(var(--gradient-purple-end))] text-destructive-foreground shadow-md">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Driver
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="space-y-4 md:space-y-2">
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader className="bg-accent text-muted-foreground">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : (
                            <div
                              className="flex items-left cursor-pointer p-0 hover:bg-secondary/50 transition-colors text-nowrap"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </div>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        onClick={() => onDriverSelect(row.original.id)}
                        className="cursor-pointer text-nowrap"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-1 items-center space-x-2">
                <Select
                  value={table.getState().pagination.pageSize.toString()}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 15, 20, 25].map((pageSize) => (
                      <SelectItem key={pageSize} value={pageSize.toString()}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">
                  {table.getFilteredSelectedRowModel().rows.length} of{' '}
                  {table.getFilteredRowModel().rows.length} row(s) selected.
                </span>
              </div>
              <div className="flex items-center justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverTableContainer;
