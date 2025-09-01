import type { FieldPath, FieldValues } from 'react-hook-form';
import { ControllerRenderProps } from 'react-hook-form';
import { JSX, ReactNode } from 'react';

export type baseOption = {
  label: string;
  wrapperFn?: (label: string) => ReactNode;
  value: string;
  count?: number;
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
