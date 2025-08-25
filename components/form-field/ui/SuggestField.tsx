'use client';

import { Button } from '@/components/form-field/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/data-table/utils';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { omit } from 'lodash-es';
import { BaseFieldProps, baseOption, OptionType } from '@/lib/form-field/form-field';
import { createSyntheticInputChange } from '@/lib/form-field/utils';
import { useOptionQuery } from '@/hooks/useOptionQuery';

export function SuggestInput({
  name,
  id = name,
  ...props
}: BaseFieldProps & {
  options: OptionType;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<baseOption[]>([]);

  const setValue = (value: string) => {
    props.onChange?.(createSyntheticInputChange(name, value));
    setOpen(false); // Close popover after selecting an item
  };

  const { data, isPending } = useOptionQuery(props.options, id);

  useEffect(() => {
    setSuggestions((prev) => [...prev, ...(data || [])]);
  }, [data]);

  const mappedSuggestions = suggestions.map((suggestion) => ({
    value: suggestion.value || 'no-value-found',
    label: suggestion.label || 'No Suggestion Found',
  }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={'!w-full'}>
        <span className={'w-full'}>
          <Button
            variant='outline'
            role='combobox'
            type='button'
            disabled={isPending}
            aria-expanded={open}
            className={cn('bg-secondary flex w-full justify-between', {
              '!text-muted-foreground': !props.value,
            })}
            onClick={() => setOpen((prev) => !prev)} // Toggle popover on click
          >
            {isPending ? (
              <Loader2 className='mx-auto w-full animate-spin' />
            ) : (
              <>
                {props.value
                  ? mappedSuggestions?.find((item) => item.value === props.value)?.label
                  : props.placeholder}
                <ChevronsUpDown className='opacity-50' />
              </>
            )}
          </Button>
        </span>
      </PopoverTrigger>
      <PopoverContent className='!w-full p-2'>
        <Command>
          <CommandInput
            {...omit(props, ['key'])}
            placeholder={props.placeholder}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>
              <div className='grid gap-1 text-center'>
                <span>No results found.</span>
                {inputValue && (
                  <Button
                    type='submit'
                    size='sm'
                    variant={'secondary'}
                    onClick={() => {
                      if (inputValue.trim()) {
                        setValue(inputValue);
                        setSuggestions((prev) => [
                          ...prev,
                          {
                            value: inputValue,
                            label: inputValue,
                          },
                        ]);
                      }
                    }}
                  >
                    Click to create a new item.
                  </Button>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {mappedSuggestions?.map((item, index) => (
                <CommandItem
                  key={item.value + index}
                  className=''
                  onSelect={() => setValue(item.value)} // Ensure value is selected & popover closes
                >
                  {item.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      props.value === item.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
