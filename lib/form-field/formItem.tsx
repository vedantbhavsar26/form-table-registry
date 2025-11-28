import React, { FC, type PropsWithChildren, useMemo } from "react";
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

/* --- Types (kept equivalent, slightly formatted) --- */
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
	? true
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

/* --- Defaults and helpers --- */
const defaultValueMap: Partial<Record<FieldType, (label: string) => string>> = {
	select: (label) => `Select ${label}`,
	dateTime: (label) => `Select ${label}`,
	number: () => "0",
	currency: () => "₹0.00",
};

const getDefaultValue = (render: unknown, label: string) => {
	// if render is a custom component function, default to "Enter <label>"
	if (typeof render === "function") return `Enter ${label.toLowerCase()}`;
	if (typeof render !== "string") return `Enter ${label.toLowerCase()}`;

	const mapFn = defaultValueMap[render as FieldType];
	return mapFn ? mapFn(label) : `Enter ${label.toLowerCase()}`;
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

/* --- Small wrapper to optionally render Form when passed UseFormReturn --- */
const Component = <T extends FieldValues = FieldValues>({
	children,
	control,
}: PropsWithChildren<{ control: Control<T> | UseFormReturn<T> }>) => {
	// If a UseFormReturn (object with 'control' prop) is passed, spread it into <Form />
	if ("control" in control) {
		return (
			<Form {...control} className="w-full">
				{children}
			</Form>
		);
	}
	// Otherwise assume it's a Control and render children directly
	return <>{children}</>;
};

/* --- Choose input component by key, fallback to text --- */
const getInputComponent = (r: FieldType) =>
	fieldComponents[r] || fieldComponents.text;

/* --- Main exported component --- */
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
	// normalize control object (either Control or UseFormReturn)
	const controlObj = "control" in control ? control.control : control;

	/* Determine requiredness by inspecting zod schema in context (if present)
       Memoized so it doesn't run on every render unless control changes. */
	const isRequired = useMemo(() => {
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
	}, [name, control]);

	/* Memoize the input component chosen from registry or a provided render function */
	// biome-ignore lint/correctness/useExhaustiveDependencies: function is rerendering
	const InputComponent = useMemo(() => {
		if (typeof render === "string")
			return getInputComponent(render) as React.FC<
				ControllerRenderProps<TFieldValues, TName> & Record<string, unknown>
			>;
		return render as React.FC<
			ControllerRenderProps<TFieldValues, TName> & Record<string, unknown>
		>;
	}, [render?.toString()]);

	const isRenderString = typeof render === "string";

	return (
		<Component control={control}>
			<Controller
				control={controlObj}
				name={name}
				render={({ field, fieldState }) => {
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
								key={field.name}
								className={cn(
									"flex w-full flex-col gap-2",
									isRenderString && fieldVariants({ render: render }),
									className?.content,
								)}
							>
								{!noLabel && (
									<FieldLabel
										data-invalid={fieldState.invalid}
										htmlFor={field.name}
										className="w-max"
									>
										{divProps.icon} {formatToTitleCase(label)}{" "}
										{isRequired ? (
											<small className="text-destructive text-sm">*</small>
										) : (
											<small className="text-muted-foreground text-sm">
												(optional)
											</small>
										)}
									</FieldLabel>
								)}

								<InputComponent
									{...field}
									{...divProps}
									key={field.name}
									className={cn(baseClassName)}
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
