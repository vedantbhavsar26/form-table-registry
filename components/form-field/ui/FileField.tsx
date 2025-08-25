import React from 'react';
import { BaseFieldProps } from '@/lib/form-field/form-field';
import ImageDropZone from '@/components/form-field/ui/ImageDropZone';

export const FileField = (
  field: BaseFieldProps & {
    multiple?: boolean;
    accept?: string;
  },
) => {
  return <ImageDropZone {...field} accept={field.accept} multiple={field.multiple} />;
};
