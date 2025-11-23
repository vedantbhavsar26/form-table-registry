"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/data-table/use-data-table";
import { data } from "@/lib/data";
// import '@faker-js/faker/locale/en';
import { formatCellValue } from "@/lib/data-table/utils";

// const generateData = () => ({
//   name: faker.person.fullName(),
//   image: faker.image.avatar(),
//   string: faker.lorem.sentence(),
//   number: faker.number.int({ min: 1, max: 1000 }),
//   boolean: faker.datatype.boolean(),
//   datetime: faker.date.anytime(),
//   date: faker.date.past(),
//   time: faker.date.recent(),
//   currency: faker.finance.amount({ min: 1, max: 1000, dec: 2 }),
//   percentage: faker.number.float({ min: 0, max: 100 }),
//   interval: `${faker.number.int({ min: 1, max: 24 })}h ${faker.number.int({ min: 0, max: 59 })}m`,
// });
//
// const data = Array.from({ length: 100 }).map(() => generateData());
// console.log({ data });

export default function Page() {
	// const searchParams = useSearchParams();
	// const filters = createBaseDataTableFilter(
	//   {
	//     name: parse,
	//   },
	//   Object.fromEntries(searchParams.entries()),
	// );
	const columns = [
		{
			accessorKey: "name",

			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={"Name"} />
			),
			id: "name",
			cell: (data) => formatCellValue(data.getValue(), "string"),
			meta: { label: "Name", variant: "text" },
			enableColumnFilter: true,
			enableSorting: false,
			size: 500,
		},
		{
			accessorKey: "image",

			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={"Image"} />
			),

			id: "image",
			cell: (data) => formatCellValue(data.getValue(), "string"),
			meta: { label: "Image" },
			enableColumnFilter: true,
			enableSorting: false,
		},
		{
			accessorKey: "string",

			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={"String"} />
			),
			id: "string",
			cell: (data) => formatCellValue(data.getValue(), "string"),
			meta: { label: "String" },
			enableColumnFilter: true,
			enableSorting: false,
		},
		{
			accessorKey: "number",

			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={"Number"} />
			),
			id: "number",
			cell: (data) => formatCellValue(data.renderValue(), "number"),
			meta: { label: "Number" },
			enableColumnFilter: true,
			enableSorting: false,
		},
		{
			accessorKey: "boolean",

			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={"Boolean"} />
			),
			id: "boolean",
			cell: (data) => formatCellValue(data.getValue(), "boolean"),
			meta: { label: "Boolean" },
			enableColumnFilter: true,
			enableSorting: false,
		},
		{
			accessorKey: "datetime",

			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={"Datetime"} />
			),
			id: "datetime",
			cell: (data) => formatCellValue(data.getValue(), "datetime"),
			meta: { label: "Datetime" },
			enableColumnFilter: true,
			enableSorting: false,
		},
		{
			accessorKey: "date",

			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={"Date"} />
			),
			id: "date",
			cell: (data) => formatCellValue(data.getValue(), "date"),
			meta: { label: "Date" },
			enableColumnFilter: true,
			enableSorting: false,
		},
		{
			accessorKey: "time",

			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={"Time"} />
			),
			id: "time",
			cell: (data) => formatCellValue(data.getValue(), "time"),
			meta: { label: "Time" },
			enableColumnFilter: true,
			enableSorting: false,
		},
		{
			accessorKey: "currency",

			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={"Currency"} />
			),
			id: "currency",
			cell: (data) => formatCellValue(data.getValue(), "currency"),
			meta: { label: "Currency" },
			enableColumnFilter: true,
			enableSorting: false,
		},
		{
			accessorKey: "percentage",

			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={"Percentage"} />
			),
			id: "percentage",
			cell: (data) => formatCellValue(data.getValue(), "percentage"),
			meta: { label: "Percentage" },
			enableColumnFilter: true,
			enableSorting: false,
		},
		{
			accessorKey: "interval",

			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={"Interval"} />
			),
			id: "interval",
			cell: (data) => formatCellValue(data.row.original.interval, "interval"),
			meta: { label: "Interval" },
			enableColumnFilter: true,
			enableSorting: false,
		},
	] satisfies ColumnDef<(typeof data)[number]>[];

	const { table } = useDataTable({
		data: data,
		columns,
		pageCount: 10,
	});

	return (
		<div className={"container mx-auto py-20"}>
			<DataTable table={table}>
				<DataTableToolbar table={table} />
			</DataTable>
		</div>
	);
}
