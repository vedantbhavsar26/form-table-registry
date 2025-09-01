import React, { useCallback, useState } from 'react';
import { debounce } from 'lodash-es';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/data-table/utils';
import { FormControl } from '@/components/ui/form';
import { CommandLoading } from 'cmdk';
import { BaseFieldProps, Options } from '@/lib/form-field/form-field';
import { useOptionQuery } from '@/hooks/useOptionQuery';
import { createSyntheticInputChange } from '@/lib/form-field/utils';

export const ComboboxField: React.FC<
  BaseFieldProps & {
    options: (searchQuery: string | undefined) => Options;
    noResultFallBack?: React.ReactNode;
  }
> = ({ noResultFallBack = 'No Result found.', options: optionFn, ...field }) => {
  const [searchQuery, setSearchQuery] = useState<string>();
  const optionsQuery = useOptionQuery(() => optionFn(searchQuery), field.name, {
    q: searchQuery,
  });
  const debounceFN = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
    }, 500),
    [],
  );

  return (
    <div className={'relative'}>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl className={'w-full'}>
            <Button
              variant='outline'
              role='combobox'
              className={cn(
                'justify-between ',
                field.className,
                !field.value && 'text-muted-foreground',
              )}
            >
              {field.value ? (
                optionsQuery.data?.find((opt) => opt.value === field.value)?.label
              ) : (
                <span className={'max-w-32 truncate'}>Select {field.label}</span>
              )}
              <ChevronsUpDown className='opacity-50' />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0' align='center'>
          <Command>
            <CommandInput
              placeholder={field.placeholder}
              className='h-9'
              onValueChange={(value) => {
                debounceFN(value);
              }}
            />
            <CommandList>
              {optionsQuery.isPending && (
                <CommandLoading>
                  <div className={'flex items-center justify-center py-4'}>
                    <Loader2 className={'animate-spin'} />
                  </div>
                </CommandLoading>
              )}
              {!optionsQuery.isPending && optionsQuery.data?.length === 0 ? (
                <CommandEmpty>{noResultFallBack}</CommandEmpty>
              ) : null}

              <CommandGroup>
                {optionsQuery.data?.map(({ label, value, icon: Icon, wrapperFn }) => (
                  <CommandItem
                    value={label}
                    key={value}
                    className={' *:w-full'}
                    onSelect={() => {
                      field.onChange(createSyntheticInputChange(field.name, value));
                    }}
                  >
                    {wrapperFn ? (
                      wrapperFn({ label, icon: Icon, value })
                    ) : (
                      <div className={'flex items-center gap-2  justify-between w-full  '}>
                        <span className={'flex items-center gap-2'}>
                          {Icon && <Icon />} {label}
                        </span>
                      </div>
                    )}
                    <Check
                      className={cn('ml-auto', value === field.value ? 'opacity-100' : 'opacity-0')}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
