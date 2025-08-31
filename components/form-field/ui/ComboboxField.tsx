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
    displayNoResultDuringSearch?: boolean;
    noResultFallBack?: React.ReactNode;
  }
> = ({
  noResultFallBack = 'No Result found.',
  displayNoResultDuringSearch = true,
  options: optionFn,
  ...field
}) => {
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
              className={cn('justify-between', !field.value && 'text-muted-foreground')}
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
        <PopoverContent className='p-0' align='start'>
          <Command>
            <CommandInput
              placeholder={field.placeholder}
              className='h-9'
              onValueChange={(value) => {
                debounceFN(value);
              }}
            />
            <CommandList>
              <CommandEmpty
                className={cn(
                  'bg-secondary m-2',
                  buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                    className: 'w-full',
                  }),
                )}
              >
                {noResultFallBack}
              </CommandEmpty>
              {optionsQuery.isPending && (
                <CommandLoading>
                  <div className={'flex items-center justify-center py-4'}>
                    <Loader2 className={'animate-spin'} />
                  </div>
                </CommandLoading>
              )}
              <CommandGroup>
                {optionsQuery.data?.map((opt) => (
                  <CommandItem
                    value={opt.label?.toString()}
                    key={opt.value}
                    onSelect={() => {
                      field.onChange(createSyntheticInputChange(field.name, opt.value));
                    }}
                  >
                    <span>
                      {opt.icon && <opt.icon />}
                      {opt.label}
                    </span>
                    <span>{opt.count && `(${opt.count})`}</span>
                    <Check
                      className={cn(
                        'ml-auto',
                        opt.value === field.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              {displayNoResultDuringSearch && (
                <CommandItem
                  className={cn(
                    'bg-secondary m-2',
                    buttonVariants({
                      variant: 'ghost',
                      size: 'sm',
                      className: 'w-full',
                    }),
                  )}
                >
                  {noResultFallBack}
                </CommandItem>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
