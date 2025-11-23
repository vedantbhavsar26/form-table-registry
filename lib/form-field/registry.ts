import { cva } from "class-variance-authority";
import { BooleanField } from "@/components/form-field/ui/BooleanField";
import { ComboboxField } from "@/components/form-field/ui/ComboboxField";
import { CurrencyField } from "@/components/form-field/ui/CurrencyField";
import { DateTimeField } from "@/components/form-field/ui/DateTimeField";
import { FileField } from "@/components/form-field/ui/FileField";
import { NumberField } from "@/components/form-field/ui/NumberField";
import PasswordField from "@/components/form-field/ui/PasswordField";
import { SelectField } from "@/components/form-field/ui/SelectField";
import { SuffixField } from "@/components/form-field/ui/SuffixField";
import { SuggestInput } from "@/components/form-field/ui/SuggestField";
import { TextField } from "@/components/form-field/ui/TextField";
import ToggleGroupComponent from "@/components/form-field/ui/ToggleGroup";
import { TextAreaField } from "@/components/form-field/ui/textAreaField";
import type { BaseFieldProps } from "@/lib/form-field/form-field";

export const fieldComponents = {
	text: TextField,
	number: NumberField,
	boolean: BooleanField,
	suffix: SuffixField,
	file: FileField,
	select: SelectField,
	textArea: TextAreaField,
	suggest: SuggestInput,
	dateTime: DateTimeField,
	combobox: ComboboxField,
	toggle: ToggleGroupComponent,
	currency: CurrencyField,
	password: PasswordField,
} as const;

export const baseClassName =
	"!bg-input/30 placeholder:!text-primary !text-primary";

type FieldComponents = typeof fieldComponents;
type keyofFieldComponents = keyof FieldComponents;

export type fallBackType = {
	disabled?: boolean;
	className?: string;
};

export type WithProps<T extends keyofFieldComponents> =
	FieldComponents[T] extends React.FC<infer P>
		? Omit<P, keyof BaseFieldProps> extends Record<string, never>
			? fallBackType
			: Omit<P, keyof BaseFieldProps> & fallBackType
		: never;

export type FieldType = keyof typeof fieldComponents;

export const fieldVariants = cva<{
	render: Partial<Record<FieldType, string>>;
}>("flex gap-2 flex-col bg-transparent", {
	variants: {
		render: {
			boolean:
				"flex items-center rounded-md border p-2 mt-5.5 justify-end flex-row-reverse space-x-2",
		},
	},
});
