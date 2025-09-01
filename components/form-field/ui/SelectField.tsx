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
import { cn, createSyntheticInputChange } from '@/lib/form-field/utils';
import { useOptionQuery } from '@/hooks/useOptionQuery';
import { BaseFieldProps, OptionType } from '@/lib/form-field/form-field';

export const SelectField: React.FC<
  BaseFieldProps & {
    options: OptionType;
    id?: string;
    customOnChange?: (value: string) => void;
    getOptionDisabled?: (value: string) => boolean;
    classNames?: {
      trigger?: string;
    };
  }
> = ({ name, id = name, customOnChange, classNames, ...field }) => {
  const options = useOptionQuery(field.options, id);
  return (
    <Select
      {...field}
      onValueChange={(e) => {
        field.onChange(createSyntheticInputChange(name, e));
        customOnChange?.(e);
      }}
    >
      <SelectTrigger className={cn(' w-full', field.className, classNames?.trigger)}>
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
              <SelectItem
                key={value}
                value={value}
                disabled={field.getOptionDisabled?.(value) || false}
              >
                {label}
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
