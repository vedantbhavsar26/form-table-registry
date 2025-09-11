import React from 'react';
import { BaseFieldProps } from '@/lib/form-field/form-field';
import ImageDropZone from '@/components/form-field/ui/ImageDropZone';

export const FileField = ({
  display = 'COMPACT',
  ...field
}: BaseFieldProps & {
  multiple?: boolean;
  accept?: string;
  display?: 'COMPACT' | 'FULL';
}) => {
  return (
    <ImageDropZone
      {...field}
      accept={field.accept}
      multiple={field.multiple}
      display={display}
    />
  );
};
