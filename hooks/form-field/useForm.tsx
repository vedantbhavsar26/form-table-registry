import { zodResolver } from "@hookform/resolvers/zod";
import type { UseFormProps } from "react-hook-form";
import { useForm as useBaseForm } from "react-hook-form";
import type { input, output, ZodObject } from "zod";

export const useForm = <Schema extends ZodObject<any>>(
	schema: Schema,
	props?: UseFormProps<
		input<Schema>,
		{
			schema: Schema;
		},
		output<Schema>
	>,
) => {
	return useBaseForm<
		input<Schema>,
		{
			schema: Schema;
		},
		output<Schema>
	>({
		resolver: zodResolver(schema),
		context: {
			schema,
		},
		...props,
	});
};
