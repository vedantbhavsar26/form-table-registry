import type { Control, FieldValues, FormProviderProps } from 'react-hook-form';
import React from 'react';
import { Form as F } from '@/components/ui/form';
import { DevTool } from '@hookform/devtools';
import { cn } from '@/lib/data-table/utils';

export const Form = <
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>({
  withDevTools,
  ...props
}: FormProviderProps<TFieldValues, TContext, TTransformedValues> & {
  onSubmit?: (values: TTransformedValues) => void;
  className?: string;
  children: React.ReactNode;
  withDevTools?: boolean;
}) => {
  return (
    <F {...props}>
      {withDevTools && (
        <DevTool control={props.control as Control} placement='top-right' />
      )}
      <form
        onSubmit={props.handleSubmit(props.onSubmit || (() => {}), (error) =>
          console.error(error),
        )}
        className={cn('grid gap-2', props.className)}
      >
        {props.children}
      </form>
    </F>
  );
};
