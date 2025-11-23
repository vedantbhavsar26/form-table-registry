import type React from "react";
import type { FC, PropsWithChildren } from "react";
import {
	type Control,
	Controller,
	type ControllerRenderProps,
	type FieldPath,
	type FieldValues,
	type UseFormReturn,
} from "react-hook-form";
import { ZodObject } from "zod";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/lib/form-field/form";
import type { BaseFieldType } from "@/lib/form-field/form-field";
import {
	baseClassName,
	type FieldType,
	fieldComponents,
	fieldVariants,
	type WithProps,
} from "@/lib/form-field/registry";
import { cn, formatToTitleCase } from "@/lib/form-field/utils";

type FunctionRenderCase<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	render: React.FC<ControllerRenderProps<TFieldValues, TName>>;
};
type NoRenderCase = {
	render?: undefined;
};
type AllPropsOptional<T> = keyof T extends never
	? true // handle empty object
	: {
				[K in keyof T]-?: object extends Pick<T, K> ? true : false;
			}[keyof T] extends true
		? true
		: false;

type KeyedRenderCase<K extends FieldType> = K extends unknown
	? {
			render: K;
		} & (WithProps<K> extends undefined
			? object
			: AllPropsOptional<WithProps<K>> extends true
				? WithProps<K> | {}
				: WithProps<K>)
	: never;

type RenderType<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
> =
	| NoRenderCase
	| FunctionRenderCase<TFieldValues, TName>
	| KeyedRenderCase<FieldType>;

interface FormItemProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
	control: Control<TFieldValues> | UseFormReturn<TFieldValues>;
	name: TName;
	description?: string;
	label?: string;
}

const defaultValueMap = {
	select: (label) => `Select ${label}`,
	dateTime: (label) => `Select ${label}`,
	number: (_) => "0",
	currency: (_) => "₹0.00",
} as Record<FieldType, (label: string) => string>;

const getDefaultValue = (render: unknown, label: string) => {
	if (typeof render === "function") return `Enter ${label.toLowerCase()}`;
	if (typeof render !== "string") return `Enter ${label.toLowerCase()}`;

	if (render in defaultValueMap) {
		return defaultValueMap[render as keyof typeof defaultValueMap](label);
	}

	return `Enter ${label.toLowerCase()}`;
};

export type FormItemComponentProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = FormItemProps<TFieldValues, TName> &
	RenderType<TFieldValues, TName> & {
		className?: {
			root?: string;
			content?: string;
			label?: string;
			description?: string;
		};
		noLabel?: boolean;
	} & Omit<BaseFieldType, "className">;

const Component = <T extends FieldValues = FieldValues>({
	children,
	control,
}: PropsWithChildren<{ control: Control<T> | UseFormReturn<T> }>) => {
	if ("control" in control) {
		return (
			<Form {...control} className={"w-full"}>
				{children}
			</Form>
		);
	} else {
		return children;
	}
};

export const FormItem = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	control,
	name,
	description,
	label = formatToTitleCase(name),
	render = "text",
	placeholder = getDefaultValue(render, label),
	noLabel = false,
	className,
	...divProps
}: FormItemComponentProps<TFieldValues, TName>) => {
	const getIsRequired = () => {
		const ctrl = "control" in control ? control.control : control;
		const context = ctrl._options.context as unknown;
		if (context && typeof context === "object" && "schema" in context) {
			if (context.schema instanceof ZodObject) {
				const schema = context.schema.shape;
				const field = schema[name as keyof typeof schema];
				if (
					field &&
					"isOptional" in field &&
					typeof field.isOptional === "function"
				) {
					return !field.isOptional();
				}
			}
		}
		return false;
	};

	const isRequired = getIsRequired();

	const getInputComponent = (r: FieldType) => {
		return fieldComponents[r] || fieldComponents.text;
	};

	return (
		<Component control={control}>
			<Controller
				control={"control" in control ? control.control : control}
				name={name}
				render={({ field, fieldState }) => {
					const InputComponent = (typeof render === "string"
						? getInputComponent(render)
						: render) as unknown as React.FC<
						ControllerRenderProps<TFieldValues, TName> & Record<string, unknown>
					>;

					return (
						<Field
							data-invalid={fieldState.invalid}
							{...divProps}
							className={cn(
								"flex w-full flex-col items-start gap-2",
								className?.root,
							)}
						>
							<FieldContent
								className={cn(
									"flex w-full flex-col gap-2",
									typeof render === "string" &&
										fieldVariants({ render: render }),
									className?.content,
								)}
							>
								{noLabel ? null : (
									<FieldLabel
										data-invalid={fieldState.invalid}
										htmlFor={field.name}
										className={"w-max"}
									>
										{divProps.icon} {formatToTitleCase(label)}{" "}
										{isRequired ? (
											<small className={"text-destructive text-sm"}>*</small>
										) : (
											<small className={"text-muted-foreground text-sm"}>
												(optional)
											</small>
										)}
									</FieldLabel>
								)}
								<InputComponent
									{...field}
									className={cn(baseClassName, className)}
									label={label}
									id={field.name}
									data-invalid={fieldState.invalid}
									placeholder={placeholder}
								/>
							</FieldContent>
							{description && (
								<FieldDescription data-invalid={fieldState.invalid}>
									{description}
								</FieldDescription>
							)}
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					);
				}}
			/>
		</Component>
	);
};
