import type React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const arraySet = (i: number) => Array.from({ length: i }, (_, i) => i);

interface DataTableSkeletonProps extends React.ComponentProps<"div"> {
	columnCount?: number;
	rowCount?: number;
	height?: {
		filter: number;
		table: number;
		pagination: number;
	};
	filterCount?: number;
	cellWidths?: string[];
	withViewOptions?: boolean;
	withPagination?: boolean;
	shrinkZero?: boolean;
}

export function DataTableSkeleton({
	columnCount = 10,
	rowCount = 30,
	filterCount = 4,
	cellWidths = ["auto"],
	height = {
		filter: 25,
		table: 40,
		pagination: 25,
	},
	withViewOptions = true,
	withPagination = true,
	shrinkZero = false,
	className,
	...props
}: DataTableSkeletonProps) {
	const cozyCellWidths = Array.from(
		{ length: columnCount },
		(_, index) => cellWidths[index % cellWidths.length] ?? "auto",
	);

	return (
		<div
			className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)}
			{...props}
		>
			<div className="flex w-full items-center justify-between gap-2 overflow-auto p-1">
				<div className="flex flex-1 items-center gap-2">
					{filterCount > 0
						? arraySet(filterCount).map((i) => (
								<Skeleton
									key={i}
									height={height?.filter}
									className={cn("h-7 w-[4.5rem] border-dashed")}
								/>
							))
						: null}
				</div>
				{withViewOptions ? (
					<Skeleton
						height={height?.filter}
						className={cn("ml-auto hidden h-7 w-[4.5rem] lg:flex")}
					/>
				) : null}
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{arraySet(1).map((i) => (
							<TableRow key={i} className="hover:bg-transparent">
								{arraySet(columnCount).map((j) => (
									<TableHead
										key={j}
										style={{
											width: cozyCellWidths[j],
											minWidth: shrinkZero ? cozyCellWidths[j] : "auto",
										}}
									>
										<Skeleton
											className={cn("h-6 w-full", height?.table)}
											height={height?.table / 1.25}
										/>
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{arraySet(rowCount).map((i) => (
							<TableRow key={i} className="hover:bg-transparent">
								{arraySet(columnCount).map((j) => (
									<TableCell
										key={j}
										style={{
											width: cozyCellWidths[j],
											minWidth: shrinkZero ? cozyCellWidths[j] : "auto",
										}}
									>
										<Skeleton
											className={cn("h-6 w-full", height?.table)}
											height={height?.table}
										/>
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			{withPagination ? (
				<div className="flex w-full items-center justify-between gap-4 overflow-auto p-1 sm:gap-8">
					<Skeleton
						className={cn("h-7 w-40 shrink-0")}
						height={height?.pagination}
					/>
					<div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
						<div className="flex items-center gap-2">
							<Skeleton
								className={cn("h-7 w-24")}
								height={height?.pagination}
							/>
							<Skeleton
								className={cn("h-7 w-[4.5rem]")}
								height={height?.pagination}
							/>
						</div>
						<div className="flex items-center justify-center font-medium text-sm">
							<Skeleton
								className={cn("h-7 w-20")}
								height={height?.pagination}
							/>
						</div>
						<div className="flex items-center gap-2">
							<Skeleton
								className={cn("hidden size-7 lg:block")}
								height={height?.pagination}
							/>
							<Skeleton className={cn("size-7")} height={height?.pagination} />
							<Skeleton className={cn("size-7")} height={height?.pagination} />
							<Skeleton
								className={cn("hidden size-7 lg:block")}
								height={height?.pagination}
							/>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
