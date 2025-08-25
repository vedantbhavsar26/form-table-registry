import React from 'react';
import { Input } from '@/components/ui/input';
import { BaseFieldProps } from '@/lib/form-field/form-field';

export const NumberField = (field: BaseFieldProps) => {
  return <Input {...field} type='number' />;
};
