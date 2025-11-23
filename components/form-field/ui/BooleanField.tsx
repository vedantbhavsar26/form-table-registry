import type React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { BaseFieldProps } from "@/lib/form-field/form-field";

export const BooleanField: React.FC<BaseFieldProps> = (field) => {
	return (
		<Checkbox
			onCheckedChange={field.onChange}
			checked={field.value}
			{...field}
		/>
	);
};
