import React, { ReactNode } from 'react';
import SuffixInputField from '@/components/form-field/ui/SuffixInputField';
import { BaseFieldProps } from '@/lib/form-field/form-field';

export const SuffixField: React.FC<
  BaseFieldProps & {
    prefix?: string;
    type?: 'number' | 'text';
    suffix?: ReactNode;
  }
> = (field) => {
  return <SuffixInputField {...field} />;
};
