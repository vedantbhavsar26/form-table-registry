import type { JSX, ReactNode } from "react";
import type {
	ControllerRenderProps,
	FieldPath,
	FieldValues,
} from "react-hook-form";

export type baseOption = {
	label: string;
	wrapperFn?: (props: Omit<baseOption, "wrapperFn">) => ReactNode;
	value: string;
	icon?: React.FC<React.SVGProps<SVGSVGElement>>;
};
export type Options = Promise<baseOption[]> | baseOption[];
export type OptionType = (q?: string) => Options;

export type BaseFieldType = {
	label?: string;
	placeholder?: string;
	icon?: JSX.Element;
	className?: string;
};

export type BaseFieldProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ControllerRenderProps<TFieldValues, TName> & BaseFieldType;

export interface SelectFieldData {
	value: string;
	label: string;
}
