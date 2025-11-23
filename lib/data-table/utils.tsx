import type {
	PostgrestClientOptions,
	PostgrestFilterBuilder,
} from "@supabase/postgrest-js";
import type {
	CellContext,
	Column,
	ColumnDef,
	ColumnMeta,
	Table,
} from "@tanstack/react-table";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { endOfDay, format, formatDuration, startOfDay } from "date-fns";
import { parseAsInteger } from "nuqs";
import {
	createSearchParamsCache,
	type ParserMap,
	type ParserWithOptionalDefault,
	type SearchParams,
} from "nuqs/server";
import type React from "react";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Badge } from "@/components/data-table/badge";
import { Button } from "@/components/data-table/button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { getSortingStateParser } from "@/lib/data-table/parsers";

// import SupabaseImage from '@/components/reusable/SupabaseImage';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getDropDownValues<TData>(data: TData[], key: keyof TData) {
	const uniqueValues = Array.from(new Set(data.map((item) => item[key])));
	return uniqueValues
		.filter((value) => value !== null && value !== undefined && value !== "")
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
		.filter((column) => column.id !== "select" && column.id !== "actions");

	// Create CSV headers
	const headers = columns.map((column) => {
		const header = column.columnDef.header;
		if (typeof header === "string") return header;
		if (typeof header === "function") return column.id;
		return column.id;
	});

	// Create CSV rows
	const csvRows = rows.map((row) =>
		columns.map((column) => {
			const cellValue = row.getValue(column.id);
			// Handle different data types
			if (cellValue === null || cellValue === undefined) return "";
			if (typeof cellValue === "object") return JSON.stringify(cellValue);
			return String(cellValue).replace(/"/g, '""'); // Escape quotes
		}),
	);

	// Combine headers and rows
	const csvContent = [headers, ...csvRows]
		.map((row) => row.map((cell) => `"${cell}"`).join(","))
		.join("\n");

	// Download CSV
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const link = document.createElement("a");

	if (link.download !== undefined) {
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", `${filename}.csv`);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}

export const ValuesMap = {
	string: ({ value }: { value: unknown }) => (
		<span>{String(value ?? "").replaceAll("_", " ") || "N/A"}</span>
	),

	boolean: ({
		value,
		trueLabel,
		falseLabel,
	}: {
		value: unknown;
		trueLabel?: string;
		falseLabel?: string;
	}) => (
		<Badge variant={value ? "success" : "destructive"}>
			{value ? trueLabel || "Yes" : falseLabel || "No"}
		</Badge>
	),

	number: ({ value, fixed = 3 }: { value: unknown; fixed?: number }) => {
		const num = Number(value);
		if (Number.isNaN(num)) return "N/A";
		return (
			<span>{new Intl.NumberFormat("en-IN").format(+num.toFixed(fixed))}</span>
		);
	},

	currency: ({ value, fixed = 3 }: { value: unknown; fixed?: number }) => {
		const num = Number(value);
		if (Number.isNaN(num)) return "N/A";
		return <span>{toInrCurrency(num.toFixed(fixed))}</span>;
	},

	date: ({ value }: { value: unknown }) => {
		const dateValue = new Date(value as unknown as Date);
		return Number.isNaN(dateValue.getTime())
			? "N/A"
			: format(dateValue, "dd/MM/yyyy");
	},

	datetime: ({ value }: { value: unknown }) => {
		const dateValue = new Date(value as unknown as Date);
		return Number.isNaN(dateValue.getTime())
			? "N/A"
			: format(dateValue, "dd/MM/yyyy hh:mm a");
	},

	time: ({ value }: { value: unknown }) => {
		const dateValue = new Date(value as unknown as Date);
		return Number.isNaN(dateValue.getTime())
			? "N/A"
			: format(dateValue, "hh:mm a");
	},

	percentage: ({ value, fixed = 2 }: { value: unknown; fixed?: number }) => {
		const num = Number(value);
		if (Number.isNaN(num)) return "N/A";
		return <span>{`${num.toFixed(fixed)}%`}</span>;
	},

	interval: ({ value }: { value: unknown }) => {
		if (!value) return "N/A";
		const [hours, minutes, seconds] = (value as string).split(":").map(Number);
		return formatDuration({
			hours,
			minutes,
			seconds: Number.isFinite(seconds) ? seconds : 0,
		});
	},
};

// -----------------
// 2. Infer Types
// -----------------
type ValuesMapType = typeof ValuesMap;
type FormatterProps<K extends keyof ValuesMapType> = Parameters<
	ValuesMapType[K]
>[0];
type FormatterOptions<K extends keyof ValuesMapType> = Omit<
	FormatterProps<K>,
	"value"
>;

// -----------------
// 3. Master formatter function
// -----------------
export function formatCellValue<
	K extends keyof ValuesMapType = "string", // default = string
>(
	value: FormatterProps<K>["value"],
	explicitType?: K,
	options?: FormatterOptions<K>,
	fallback: ReactNode = <span className="text-muted-foreground">N/A</span>,
): ReactNode {
	if (value === null || value === undefined) return fallback;
	const type = explicitType ?? ("string" as K);
	return ValuesMap[type]({ value, ...(options as any) });
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

export function formatToTitleCase(input: string): string {
	const words = input
		// Replace underscores with spaces
		.replace(/_/g, " ")
		// Split camelCase by inserting a space before uppercase letters
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.split(" ");

	return words
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}
export function toInrCurrency(
	...value: (number | null | undefined | string)[]
): string {
	const totalValue = value.reduce<number>(
		(acc, curr) => acc + Number(curr || 0),
		0,
	);
	return totalValue.toLocaleString("en-IN", {
		style: "currency",
		currency: "INR",
	});
}

export function getCommonPinningStyles<TData>({
	column,
	withBorder = false,
}: {
	column: Column<TData>;
	withBorder?: boolean;
}): React.CSSProperties {
	const isPinned = column.getIsPinned();
	const isLastLeftPinnedColumn =
		isPinned === "left" && column.getIsLastColumn("left");
	const isFirstRightPinnedColumn =
		isPinned === "right" && column.getIsFirstColumn("right");

	return {
		boxShadow: withBorder
			? isLastLeftPinnedColumn
				? "-4px 0 4px -4px hsl(var(--border)) inset"
				: isFirstRightPinnedColumn
					? "4px 0 4px -4px hsl(var(--border)) inset"
					: undefined
			: undefined,
		left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
		right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
		opacity: isPinned ? 0.97 : 1,
		position: isPinned ? "sticky" : "relative",
		background: isPinned ? "hsl(var(--background))" : "hsl(var(--background))",
		width: column.columnDef.size,
		minWidth: column.columnDef.minSize,
		maxWidth: column.columnDef.maxSize,
		zIndex: isPinned ? 1 : 0,
	};
}

type FilterOperator =
	| "eq"
	| "neq"
	| "gt"
	| "gte"
	| "lt"
	| "lte"
	| "like"
	| "ilike"
	| "is"
	| "in"
	| "cs"
	| "cd"
	| "sl"
	| "sr"
	| "nxl"
	| "nxr"
	| "adj"
	| "ov"
	| "fts"
	| "plfts"
	| "phfts"
	| "wfts";

export const createOrFilter = <T extends Record<any, any>>(
	filter: Filter<T>[],
) => {
	return filter
		.map((curr) => {
			if (!curr.value) return "";
			return `${curr.key.toString()}.${curr.operator}.${getFilterWrapper(curr.value, curr.operator)}`;
		})
		.filter(Boolean)
		.join(",");
};
export type Filter<T extends Record<string, any>> = {
	key: keyof T;
	operator: `${"" | "not."}${FilterOperator}`;
	value: string | undefined | null;
};
export type SupabaseFilter<T extends Record<string, any>> = {
	perPage?: number;
	page?: number;
	filter?: Filter<T>[];
	sort?: { id: keyof T | string; desc: boolean }[];
	or?: Filter<T>[];
};
export const getFilterWrapper = (value: string, operator: string) => {
	switch (operator) {
		case "in":
			return `(${value})`;
		case "like":
		case "ilike":
			return `%${value}%`;
	}
	return value;
};
export function rangeFilter<T extends Record<any, any>>(
	id: keyof T,
	from: number | null | undefined,
	to: number | null | undefined,
) {
	return [
		{
			key: id,
			operator: "lte",
			value: to ? String(to) : null,
		},
		{
			key: id,
			operator: "gte",
			value: from ? String(from) : null,
		},
	] satisfies Filter<T>[];
}

export function dateRangeFilter<T extends Record<any, any>>(
	id: keyof T,
	from: number | null | undefined,
	to: number | null | undefined,
) {
	return [
		{
			key: id,
			operator: "lte",
			value: to ? format(endOfDay(to), "yyyy-MM-dd'T'HH:mm:ssXX") : null,
		},
		{
			key: id,
			operator: "gte",
			value: from ? format(startOfDay(from), "yyyy-MM-dd'T'HH:mm:ssXX") : null,
		},
	] satisfies Filter<T>[];
}

export const createBaseDataTableFilter = <
	Table extends Record<string, unknown>,
	T extends ParserMap =
		| ParserMap
		| Record<keyof Table, ParserWithOptionalDefault<any>>,
>(
	addon: T,
	searchParams: SearchParams,
) => {
	const cache = createSearchParamsCache({
		page: parseAsInteger.withDefault(1),
		perPage: parseAsInteger.withDefault(10),
		sort: getSortingStateParser<Table>().withDefault([]),
		...addon,
	});

	return cache.parse(searchParams);
};

export const columnDef = <T extends Record<any, any>>(
	id: string,
	{
		label = formatToTitleCase(id),
		accessorKey = id,
		formatType,
		cell = (data) => formatCellValue(data.getValue(), formatType || "string"),
		meta,
		enableSorting = false,
		enableColumnFilter = true,
	}: {
		accessorKey?: string;
		formatType?: keyof typeof ValuesMap;
		label?: string;
		meta?: ColumnMeta<T, any>;
		cell?: (data: CellContext<T, unknown>) => ReactNode;
		enableSorting?: boolean;
		enableColumnFilter?: boolean;
	} = {
		label: formatToTitleCase(id),
		accessorKey: id,
		cell: (data) => formatCellValue(data.getValue(), formatType || "string"),
		enableSorting: false,
		enableColumnFilter: true,
	},
) => {
	return {
		id,
		accessorKey,
		cell,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title={label} />
		),
		meta: {
			label,
			...meta,
		},
		enableColumnFilter,
		enableSorting,
	} satisfies ColumnDef<T>;
};

export const GenerateColumnsDef = (
	data: Record<string, any> | [Record<string, any>] | undefined | null,
) => {
	if (!data) return "NO DATA";
	const parsedData = Array.isArray(data) ? data[0] : data;
	const str = Object.keys(parsedData).reduce((acc, curr) => {
		acc += `columnDef('${curr}'),\n`;
		return acc;
	}, "");
	navigator?.clipboard?.writeText(str);
	return (
		<pre className={"rounded-md bg-muted/50 p-2"}>
			<Button onClick={() => navigator.clipboard.writeText(str)}>COPY</Button>
			<code>{str}</code>
		</pre>
	);
};

type DB = {
	public: {
		Tables: any;
		Views: any;
		Functions: any;
	};
};
type Schema = DB["public"];

type SupabaseTableName = keyof Schema["Tables"];
type SupabaseViewName = keyof Schema["Views"];

export const supabaseFilter = <
	ResultOne extends Record<string, any>,
	TableName extends SupabaseTableName | SupabaseViewName,
	Client = PostgrestFilterBuilder<
		PostgrestClientOptions,
		Schema,
		TableName extends SupabaseTableName
			? Schema["Tables"][TableName]["Row"]
			: TableName extends SupabaseViewName
				? Schema["Views"][TableName]["Row"]
				: unknown,
		ResultOne[],
		TableName,
		(
			TableName extends SupabaseTableName
				? Schema["Tables"][TableName]
				: TableName extends SupabaseViewName
					? Schema["Views"][TableName]
					: unknown
		) extends { Relationships: infer R }
			? R
			: unknown,
		"GET"
	>,
>(
	client: Client,
	{
		perPage,
		page,
		filter = [],
		sort,
		or = undefined,
	}: SupabaseFilter<ResultOne> = {
		perPage: undefined,
		page: undefined,
		filter: [],
		sort: undefined,
		or: undefined,
	},
) => {
	if (
		!(
			client &&
			typeof client === "object" &&
			"range" in client &&
			typeof client.range === "function" &&
			"or" in client &&
			typeof client.or === "function"
		)
	)
		return client;

	const sortArray = Array.isArray(sort) ? sort : sort ? [sort] : [];
	if (sortArray.length > 0) {
		const sortArray = Array.isArray(sort) ? sort : sort ? [sort] : [];
		sortArray.forEach((sort) => {
			if (!("order" in client && typeof client.order === "function")) return;
			client.order(sort.id.toString(), {
				ascending: !sort.desc,
			});
		});
	}

	filter.forEach((f) => {
		if (!f.value) return;
		if (!("filter" in client && typeof client.filter === "function")) return;
		client.filter(
			f.key.toString(),
			f.operator,
			getFilterWrapper(f.value, f.operator),
		);
	});
	if (or && or.length > 0) {
		client.or(createOrFilter(or || []));
	}
	if (perPage && page) {
		client.range((page - 1) * perPage, page * perPage - 1);
	}
	return client;
};
