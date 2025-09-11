import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { BaseFieldProps } from '@/lib/form-field/form-field';

export const TextAreaField: React.FC<
  BaseFieldProps & {
    rows?: number;
    cols?: number;
  }
> = (field) => {
  return (
    <Textarea
      className='bg-secondary w-full rounded-md border p-2'
      {...field}
    />
  );
};
