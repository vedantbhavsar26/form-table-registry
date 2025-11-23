"use client";
import { faker } from "@faker-js/faker";
import { Button } from "@/components/data-table/button";

type JSONValue =
	| string
	| number
	| boolean
	| null
	| Record<string, unknown>
	| Date;
type JSONObject = { [key: string]: JSONValue };
type JSONArray = JSONObject[];

function escapeValue(value: JSONValue): string {
	if (value === null || value === undefined) return "NULL";

	if (value instanceof Date) {
		// Format as ISO string and remove 'T' for PostgreSQL
		return `'${value.toISOString().replace("T", " ").replace("Z", "")}'`;
	}

	if (typeof value === "object") {
		// JSON object/array
		return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
	}

	if (typeof value === "string") {
		return `'${value.replace(/'/g, "''")}'`;
	}

	if (typeof value === "boolean") return value ? "TRUE" : "FALSE";

	return value.toString();
}

/**
 * Generates a PostgreSQL INSERT query from JSON object(s)
 * @param tableName Name of the table
 * @param data JSON object or array of objects
 * @returns SQL insert query string
 */
function jsonToInsertQuery(
	tableName: string,
	data: JSONObject | JSONArray,
): string {
	const rows = Array.isArray(data) ? data : [data];

	if (rows.length === 0) throw new Error("No data provided");

	// Use keys from the first object as columns
	const columns = Object.keys(rows[0]);
	const columnList = columns.map((col) => `"${col}"`).join(", ");

	const valuesList = rows
		.map((row) => {
			const values = columns.map((col) => escapeValue(row[col]));
			return `(${values.join(", ")})`;
		})
		.join(",\n");

	return `INSERT INTO "${tableName}" (${columnList}) VALUES\n${valuesList};`;
}

export default function Page() {
	const generateProduct = () => {
		const _productName = faker.commerce.productName();
		return {};
	};

	const data = Array.from({ length: 100 }, generateProduct);
	const preview = jsonToInsertQuery("products", data);
	return (
		<pre>
			<Button
				onClick={() => {
					navigator.clipboard.writeText(preview);
				}}
			>
				Copy
			</Button>
			<hr />
			<code className={"whitespace-break-spaces"}>
				{JSON.stringify(preview, null, 2)}
			</code>
		</pre>
	);
}
