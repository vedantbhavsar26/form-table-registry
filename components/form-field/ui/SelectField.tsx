import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/data-table/utils';
import { useOptionQuery } from '@/hooks/useOptionQuery';
import { createSyntheticInputChange } from '@/lib/form-field/utils';
import { BaseFieldProps, OptionType } from '@/lib/form-field/form-field';

export const SelectField: React.FC<
  BaseFieldProps & {
    options: OptionType;
    id?: string;
    classNames?: {
      trigger?: string;
    };
  }
> = ({ name, id = name, classNames, ...field }) => {
  const options = useOptionQuery(field.options, id);
  return (
    <Select {...field} onValueChange={(e) => field.onChange(createSyntheticInputChange(name, e))}>
      <SelectTrigger className={cn('bg-secondary w-full', classNames?.trigger)}>
        <SelectValue placeholder={field.placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{field.label}</SelectLabel>
          {options.isLoading ? (
            <SelectItem value='loading' disabled>
              Loading...
            </SelectItem>
          ) : options.isError ? (
            <SelectItem value='error' disabled>
              Error loading options
            </SelectItem>
          ) : (
            options.data?.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
