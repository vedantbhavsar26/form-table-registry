import React from 'react';
import { Group, Input, NumberField } from 'react-aria-components';
import { BaseFieldProps } from '@/lib/form-field/form-field';

export const CurrencyField: React.FC<
  BaseFieldProps & {
    formatOptions?: Intl.NumberFormatOptions;
  }
> = ({
  formatOptions = {
    style: 'currency',
    currency: 'INR',
    currencySign: 'accounting',
  },
  ...props
}) => (
  <NumberField {...props} formatOptions={formatOptions}>
    <div className='*:not-first:mt-2'>
      <Group className='border-input doutline-none data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] data-disabled:opacity-50 data-focus-within:ring-[3px]'>
        <Input className='bg-input/30 text-foreground flex-1 px-3 py-2 tabular-nums' />
      </Group>
    </div>
  </NumberField>
);
