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
      {...field}
      className='w-full p-2 border bg-secondary rounded-md'
      placeholder={`Enter ${field.name}`}
    />
  );
};
