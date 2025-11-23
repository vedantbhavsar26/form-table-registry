import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import type React from "react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn, getCommonPinningStyles } from "@/lib/data-table/utils";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
	table: TanstackTable<TData>;
	actionBar?: React.ReactNode;
	cellHeight?: string;
	showPagination?: boolean;
}

export function DataTable<TData>({
	table,
	actionBar,
	children,
	className,
	cellHeight = "h-20",
	showPagination = true,
	...props
}: DataTableProps<TData>) {
	return (
		<div
			className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)}
			{...props}
		>
			{children}
			<div className="overflow-hidden rounded-md border">
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
									data-state={row.getIsSelected() && "selected"}
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
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex flex-col justify-end gap-2.5">
				{showPagination && <DataTablePagination table={table} />}
				{actionBar &&
					table.getFilteredSelectedRowModel().rows.length > 0 &&
					actionBar}
			</div>
		</div>
	);
}
