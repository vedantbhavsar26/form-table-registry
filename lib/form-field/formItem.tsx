import { Control, ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';
import React, { FC } from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem as FormItemBase,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { fieldComponents, FieldType, fieldVariants, WithProps } from '@/lib/form-field/registry';
import { BaseFieldType } from '@/lib/form-field/form-field';
import { formatToTitleCase } from '@/lib/form-field/utils';

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
      ? { props?: undefined }
      : AllPropsOptional<WithProps<K>> extends true
        ? { props?: WithProps<K> }
        : { props: WithProps<K> })
  : never;

type RenderType<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> =
  | NoRenderCase
  | FunctionRenderCase<TFieldValues, TName>
  | KeyedRenderCase<FieldType>;

interface FormItemProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  description?: string;
  label?: string;
  containerClassName?: string;
}

type FormItemComponentProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = FormItemProps<TFieldValues, TName> &
  RenderType<TFieldValues, TName> & {
    className?: string;
    noLabel?: boolean;
    required?: boolean;
  } & BaseFieldType;

const getDefaultValue = (render: FieldType | FC<ControllerRenderProps>, label: string) => {
  if (typeof render === 'function') return `Enter ` + `${formatToTitleCase(label).toLowerCase()}`;

  if (['suggest', 'select', 'dateTime'].includes(render))
    return `Select ` + `${formatToTitleCase(label).toLowerCase()}`;

  if (['file'].includes(render))
    return `Upload or Drop ` + `${formatToTitleCase(label).toLowerCase()}`;

  return `Enter ` + `${formatToTitleCase(label).toLowerCase()}`;
};

export const FormItem = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  description,
  label = name,
  render = 'text',
  containerClassName,
  // @ts-expect-error type error
  placeholder = getDefaultValue(render, label),
  noLabel = false,
  required = true,
  ...divProps
}: FormItemComponentProps<TFieldValues, TName>) => {
  const getProps = () => {
    if ('props' in divProps) {
      return divProps.props || {};
    }
  };

  const getInputComponent = (r: FieldType) => {
    return fieldComponents[r] || fieldComponents.text;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const InputComponent = (typeof render === 'string'
          ? getInputComponent(render)
          : render) as unknown as React.FC<ControllerRenderProps<TFieldValues, TName>>;

        return (
          <FormItemBase
            {...divProps}
            className={cn('flex w-full flex-col items-start gap-2', divProps.className)}
          >
            {noLabel ? (
              <div
                className={cn(
                  'flex w-full flex-col gap-2',
                  typeof render === 'string' && fieldVariants({ render: render }),
                  containerClassName,
                )}
              >
                <FormControl className={'w-full'}>
                  <InputComponent
                    {...field}
                    {...getProps()}
                    // @ts-expect-error type error
                    label={label}
                    placeholder={placeholder}
                  />
                </FormControl>
              </div>
            ) : (
              <div
                className={cn(
                  'flex w-full flex-col gap-2',
                  typeof render === 'string' && fieldVariants({ render: render }),
                  containerClassName,
                )}
              >
                <FormLabel className={'w-max'}>
                  {divProps.icon} {formatToTitleCase(label)}{' '}
                  {required ? (
                    <small className={'text-destructive text-base'}>*</small>
                  ) : (
                    <small className={'text-muted-foreground text-sm'}>(optional)</small>
                  )}
                </FormLabel>
                <FormControl>
                  <InputComponent
                    {...field}
                    {...getProps()}
                    // @ts-expect-error type error
                    label={label}
                    placeholder={placeholder}
                  />
                </FormControl>
              </div>
            )}
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItemBase>
        );
      }}
    />
  );
};
