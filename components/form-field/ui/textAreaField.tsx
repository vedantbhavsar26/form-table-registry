import type React from "react";
import { Textarea } from "@/components/ui/textarea";
import type { BaseFieldProps } from "@/lib/form-field/form-field";

export const TextAreaField: React.FC<
	BaseFieldProps & {
		rows?: number;
		cols?: number;
	}
> = (field) => {
	return (
		<Textarea
			className="w-full rounded-md border bg-secondary p-2"
			{...field}
		/>
	);
};
