'use client';

import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/data-table/utils';
import { BaseFieldProps, OptionType } from '@/lib/form-field/form-field';
import { useOptionQuery } from '@/hooks/useOptionQuery';

export default function ToggleGroupComponent({
  className,
  itemClassName,
  options,
  ...props
}: BaseFieldProps & {
  options: OptionType;
  className?: string;
  itemClassName?: string;
}) {
  const optionsQuery = useOptionQuery(options, props.name);
  if (optionsQuery.isPending) {
    return <div>Loading...</div>;
  }
  if (optionsQuery.isError) {
    return <div>Error: {optionsQuery.error.message}</div>;
  }
  return (
    <ToggleGroup
      type='single'
      variant='outline'
      className={cn('w-full overflow-x-auto', className)}
      {...props}
      value={props.value}
      onValueChange={(value) => {
        if (value) props.onChange?.(value);
      }}
    >
      {optionsQuery.data.map((option) => (
        <ToggleGroupItem
          className={cn('h-auto flex-1 p-2', itemClassName)}
          value={option.value}
          key={option.value}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
