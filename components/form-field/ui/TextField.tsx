import React from 'react';
import { Input } from '@/components/ui/input';
import { BaseFieldProps } from '@/lib/form-field/form-field';

export const TextField: React.FC<BaseFieldProps> = (field) => {
  return <Input {...field} />;
};
