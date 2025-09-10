'use client';

import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/form-field/utils';
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
      className={cn('flex w-full flex-wrap overflow-x-auto', className)}
      {...props}
      value={props.value}
      onValueChange={(value) => {
        if (value) props.onChange?.(value);
      }}
    >
      {optionsQuery.data.map(({ label, icon: Icon, value, wrapperFn }) => (
        <ToggleGroupItem
          className={cn('h-max min-w-max p-2', itemClassName, {
            'text-muted-foreground': props.value !== value,
          })}
          value={value}
          key={value}
        >
          {wrapperFn ? (
            wrapperFn({ label, icon: Icon, value })
          ) : (
            <div className={'flex w-full items-center justify-between gap-2'}>
              <span className={'flex items-center gap-2'}>
                {Icon && <Icon />} {label}
              </span>
            </div>
          )}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
