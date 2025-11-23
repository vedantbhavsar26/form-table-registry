import type React from "react";
import { Input } from "@/components/ui/input";
import type { BaseFieldProps } from "@/lib/form-field/form-field";

export const TextField: React.FC<BaseFieldProps> = (field) => {
	return <Input {...field} />;
};
