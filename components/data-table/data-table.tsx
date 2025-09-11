import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';
import React from 'react';

import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { getCommonPinningStyles } from '@/lib/data-table/utils';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  cellHeight?: string;
  showPagination?: boolean;
}

function DataTableInner<TData>({
  table,
  actionBar,
  children,
  className,
  cellHeight = 'h-20',
  showPagination = true,
  ...props
}: DataTableProps<TData>) {
  return (
    <div
      className={cn('flex w-full flex-col gap-2.5 overflow-auto', className)}
      {...props}
    >
      {children}
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getCommonPinningStyles({ column: header.column }),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cellHeight}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column }),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex flex-col justify-end gap-2.5'>
        {showPagination && <DataTablePagination table={table} />}
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}

function areEqual<TData>(
  prev: DataTableProps<TData>,
  next: DataTableProps<TData>,
) {
  if (prev.table !== next.table) return false;
  // Re-render when TanStack table state changes
  if (prev.table.getState() !== next.table.getState()) return false;
  if (prev.actionBar !== next.actionBar) return false;
  if (prev.children !== next.children) return false;
  if (prev.className !== next.className) return false;
  if (prev.cellHeight !== next.cellHeight) return false;
  if (prev.showPagination !== next.showPagination) return false;
  // Shallow-equal other div props we spread
  const {
    table: _t1,
    actionBar: _a1,
    cellHeight: _c1,
    showPagination: _s1,
    className: _cl1,
    children: _ch1,
    ...restPrev
  } = prev;
  const {
    table: _t2,
    actionBar: _a2,
    cellHeight: _c2,
    showPagination: _s2,
    className: _cl2,
    children: _ch2,
    ...restNext
  } = next;
  const prevKeys = Object.keys(restPrev);
  const nextKeys = Object.keys(restNext);
  if (prevKeys.length !== nextKeys.length) return false;
  for (const key of prevKeys) {
    if (restPrev[key as never] !== restNext[key as never]) return false;
  }
  return true;
}

export const DataTable = React.memo(
  DataTableInner,
  areEqual,
) as typeof DataTableInner;
