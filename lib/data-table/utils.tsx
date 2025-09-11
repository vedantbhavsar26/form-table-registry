import type { ColumnDef, Table } from '@tanstack/react-table';
import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import React, { ReactNode } from 'react';
import { format, formatDuration } from 'date-fns';
import { Badge } from '@/components/data-table/badge';
import { Button } from '@/components/data-table/button';
// import SupabaseImage from '@/components/reusable/SupabaseImage';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDropDownValues<TData>(data: TData[], key: keyof TData) {
  const uniqueValues = Array.from(new Set(data.map((item) => item[key])));
  return uniqueValues
    .filter((value) => value !== null && value !== undefined && value !== '')
    .map((value) => ({
      label: String(value),
      value: String(value),
    }));
}

export function exportTableToCSV<TData>(
  table: Table<TData>,
  options: {
    filename: string;
    excludeColumns?: string[];
    onlySelected?: boolean;
  },
) {
  const { filename, excludeColumns = [], onlySelected = false } = options;

  const rows = onlySelected
    ? table.getFilteredSelectedRowModel().rows
    : table.getFilteredRowModel().rows;

  const columns = table
    .getAllColumns()
    .filter(
      (column) => column.getIsVisible() && !excludeColumns.includes(column.id),
    )
    .filter((column) => column.id !== 'select' && column.id !== 'actions');

  // Create CSV headers
  const headers = columns.map((column) => {
    const header = column.columnDef.header;
    if (typeof header === 'string') return header;
    if (typeof header === 'function') return column.id;
    return column.id;
  });

  // Create CSV rows
  const csvRows = rows.map((row) =>
    columns.map((column) => {
      const cellValue = row.getValue(column.id);
      // Handle different data types
      if (cellValue === null || cellValue === undefined) return '';
      if (typeof cellValue === 'object') return JSON.stringify(cellValue);
      return String(cellValue).replace(/"/g, '""'); // Escape quotes
    }),
  );

  // Combine headers and rows
  const csvContent = [headers, ...csvRows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

type ValueMapFN = {
  value: unknown;
};
export const ValuesMap = {
  string: ({ value }: ValueMapFN) => (
    <span>{String(value).replaceAll('_', ' ') || 'N/A'}</span>
  ),
  boolean: ({
    value,
    falseLabel,
    trueLabel,
  }: ValueMapFN & {
    trueLabel?: string;
    falseLabel?: string;
  }) => (
    <Badge variant={value ? 'success' : 'destructive'}>
      {value ? trueLabel || 'Yes' : falseLabel || 'No'}
    </Badge>
  ),

  number: ({ value, fixed = 3 }: ValueMapFN & { fixed: number }) => (
    <span>
      {new Intl.NumberFormat('en-IN').format(
        Number(Number(value).toFixed(fixed)),
      ) || 'N/A'}
    </span>
  ),

  currency: ({ value, fixed = 3 }: ValueMapFN & { fixed: number }) => (
    <span>{toInrCurrency(Number(value).toFixed(fixed)) || 'N/A'}</span>
  ),

  date: ({ value }: ValueMapFN) => {
    const dateValue = new Date(String(value));
    return format(dateValue, 'eee dd MMM yyyy');
  },
  percentage: ({
    value,
    fixed = 2,
  }: ValueMapFN & {
    fixed?: number;
  }) => {
    return <span>{Number(value).toFixed(fixed) + '%'}</span>;
  },

  datetime: ({ value }: ValueMapFN) => {
    const dateValue = new Date(String(value));
    return format(dateValue, 'dd-MM-yyyy hh:mm a');
  },
  time: ({ value }: ValueMapFN) => {
    const dateValue = new Date(String(value));
    return format(dateValue, 'hh:mm a');
  },
  interval: ({ value }: ValueMapFN) => {
    const [hours, minutes, seconds] = String(value).split(':').map(Number);
    return formatDuration({
      hours,
      minutes,
      seconds: Number(Number(seconds).toFixed(0)),
    });
  },
  // image: ({ value }: ValueMapFN) => {
  //   const imageIds = Array.isArray(value) ? value : [value];
  //   return (
  //     <div>
  //       {imageIds.map((imageId) => (
  //         <SupabaseImage
  //           width={100}
  //           alt={'imageId'}
  //           height={100}
  //           fileId={imageId}
  //           key={imageId}
  //         />
  //       ))}
  //     </div>
  //   );
  // },
};

export function formatCellValue(
  value: unknown,
  explicitType: keyof typeof ValuesMap = 'string',
  options?: Record<string, unknown>,
  fallback: ReactNode = <span className={'text-muted-foreground'}>N/A</span>,
): ReactNode {
  if (value === null || value === undefined) return fallback;
  // @ts-expect-error type error
  return ValuesMap[explicitType]({ value, ...options });
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function addColumnFilter<T>(column: ColumnDef<T>[]) {
  return column.map((col) => {
    return {
      ...col,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    };
  }) as ColumnDef<T>[];
}

export const GenerateColumns = (
  data: Record<string, unknown> | [Record<string, unknown>] | undefined | null,
) => {
  if (!data) return 'NO DATA';
  const parsedData = Array.isArray(data) ? data[0] : data;

  const str = Object.keys(parsedData).reduce((acc, curr) => {
    acc += `{ accessorKey: '${curr}', 

    header: ({column}) => <DataTableColumnHeader column={column} title={'${formatToTitleCase(curr)}'} />,
    id: '${curr}',
    cell: (data) => formatCellValue(data.getValue(), 'string'),
    meta: {label: '${formatToTitleCase(curr)}'},
    enableColumnFilter: true,
      enableSorting: false
        
     },\n`;
    return acc;
  }, '');
  navigator?.clipboard?.writeText(str);
  return (
    <pre className={'bg-muted/50 rounded-md p-2'}>
      <Button onClick={() => navigator.clipboard.writeText(str)}>COPY</Button>
      <code>{str}</code>
    </pre>
  );
};

export function CompareObject(obj1: object, obj2: object) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function formatToTitleCase(input: string): string {
  const words = input
    // Replace underscores with spaces
    .replace(/_/g, ' ')
    // Split camelCase by inserting a space before uppercase letters
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ');

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
export function toInrCurrency(
  ...value: (number | null | undefined | string)[]
): string {
  const totalValue = value.reduce<number>(
    (acc, curr) => acc + Number(curr || 0),
    0,
  );
  return totalValue.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  });
}

import type { Column } from '@tanstack/react-table';
import { dataTableConfig } from '@/lib/data-table/config/config';
import type {
  ExtendedColumnFilter,
  FilterOperator,
  FilterVariant,
} from '@/lib/data-table/types/data-table';

export function getCommonPinningStyles<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>;
  withBorder?: boolean;
}): React.CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    boxShadow: withBorder
      ? isLastLeftPinnedColumn
        ? '-4px 0 4px -4px hsl(var(--border)) inset'
        : isFirstRightPinnedColumn
          ? '4px 0 4px -4px hsl(var(--border)) inset'
          : undefined
      : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? 'sticky' : 'relative',
    background: isPinned ? 'hsl(var(--background))' : 'hsl(var(--background))',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
}

export function getFilterOperators(filterVariant: FilterVariant) {
  const operatorMap: Record<
    FilterVariant,
    { label: string; value: FilterOperator }[]
  > = {
    text: dataTableConfig.textOperators,
    number: dataTableConfig.numericOperators,
    range: dataTableConfig.numericOperators,
    date: dataTableConfig.dateOperators,
    dateRange: dataTableConfig.dateOperators,
    boolean: dataTableConfig.booleanOperators,
    select: dataTableConfig.selectOperators,
    multiSelect: dataTableConfig.multiSelectOperators,
  };

  return operatorMap[filterVariant] ?? dataTableConfig.textOperators;
}

export function getDefaultFilterOperator(filterVariant: FilterVariant) {
  const operators = getFilterOperators(filterVariant);

  return operators[0]?.value ?? (filterVariant === 'text' ? 'iLike' : 'eq');
}

export function getValidFilters<TData>(
  filters: ExtendedColumnFilter<TData>[],
): ExtendedColumnFilter<TData>[] {
  return filters.filter(
    (filter) =>
      filter.operator === 'isEmpty' ||
      filter.operator === 'isNotEmpty' ||
      (Array.isArray(filter.value)
        ? filter.value.length > 0
        : filter.value !== '' &&
          filter.value !== null &&
          filter.value !== undefined),
  );
}
