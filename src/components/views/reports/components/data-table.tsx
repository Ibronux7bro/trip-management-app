'use client';

import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnDef,
  Table,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  title: string;
  showCheckbox?: boolean;
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
}

export default function DataTable<T>({
  data,
  columns,
  title,
  showCheckbox = true,
  sorting,
  setSorting,
  globalFilter,
  setGlobalFilter,
  pagination,
  setPagination,
  rowSelection,
  setRowSelection,
}: DataTableProps<T>) {
  const finalColumns = React.useMemo(() => {
    if (!showCheckbox) {
      return columns;
    }

    const checkboxColumn: ColumnDef<T, any> = {
      id: 'select',
      header: ({ table }: { table: Table<T> }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="rounded border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="rounded border-gray-300"
        />
      ),
    };

    return [checkboxColumn, ...columns];
  }, [columns, showCheckbox]);

  const table = useReactTable<T>({
    data,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
      pagination,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
  });

  return (
    <div className="space-y-4">
      <h3 className="text-base px-6">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse divide-y divide-border">
          <thead className="bg-accent text-muted-foreground">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b text-left text-sm">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3 whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border text-muted-foreground">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="text-sm">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-3 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row items-center justify-start md:justify-end gap-4 p-4 md:p-6">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Rows per page:
          </span>
          <select
            className="border border-border bg-accent rounded px-2 py-1"
            value={pagination.pageSize}
            onChange={(e) =>
              setPagination({ ...pagination, pageSize: Number(e.target.value) })
            }
          >
            {[5, 10, 15, 20, 25, 30].map((pageSize) => (
              <option
                key={pageSize}
                value={pageSize}
                className="bg-card text-muted-foreground"
              >
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {pagination.pageIndex * pagination.pageSize + 1}-
            {Math.min(
              (pagination.pageIndex + 1) * pagination.pageSize,
              data.length
            )}{' '}
            of {data.length}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              onClick={() =>
                setPagination({
                  ...pagination,
                  pageIndex: pagination.pageIndex - 1,
                })
              }
              disabled={pagination.pageIndex === 0}
              className="p-1"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setPagination({
                  ...pagination,
                  pageIndex: pagination.pageIndex + 1,
                })
              }
              disabled={
                (pagination.pageIndex + 1) * pagination.pageSize >= data.length
              }
              className="p-1"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
