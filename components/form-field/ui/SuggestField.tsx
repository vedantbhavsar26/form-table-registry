import { cn } from '@/lib/utils';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, Loader2 } from 'lucide-react';
import React, { ReactNode, useMemo, useRef, useState } from 'react';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { BaseFieldProps, baseOption, OptionType } from '@/lib/form-field/form-field';
import { useOptionQuery } from '@/hooks/useOptionQuery';
import { createSyntheticInputChange } from '@/lib/form-field/utils';
import { buttonVariants } from '@/components/form-field/ui/button';
import { useDebounceState } from '@/hooks/useDebounceState';
type Props<T extends string> = BaseFieldProps & {
  selectedValue: T;

  options: OptionType;
  fallbackFn?: (value: string) => ReactNode;
};

export function SuggestInput<T extends string>({
  selectedValue,
  onChange,
  name,
  value,
  options,
  fallbackFn,
  placeholder = 'Search...',
  ...fields
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useDebounceState<string>();
  const items = useOptionQuery(() => options(searchQuery), name, { q: searchQuery });
  const [customOptions, setCustomOptions] = useState<baseOption[]>([]);
  const ref = useRef<HTMLInputElement>(null);

  const opts = useMemo(
    () => [
      ...customOptions.filter((e) => e.value.startsWith(searchQuery || '')),
      ...(items.data || []),
    ],
    [customOptions, items.data, searchQuery],
  );

  const labels = useMemo(
    () =>
      opts?.reduce(
        (acc, item) => {
          acc[item.value] = item.label;
          return acc;
        },
        {} as Record<string, string>,
      ),
    [opts],
  );
  const [customValue, setCustomValue] = useState<string>(labels?.[value]);

  const onSelectItem = (inputValue: string, isNew: boolean = false) => {
    onChange(createSyntheticInputChange(name, inputValue));
    if (isNew) {
      setCustomOptions((prev) => [...prev, { label: inputValue, value: inputValue }]);
      setCustomValue(inputValue);
    } else {
      setCustomValue(labels?.[inputValue]);
    }
    setOpen(false);
  };

  return (
    <div className='flex items-center'>
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <PopoverAnchor asChild>
            <CommandPrimitive.Input
              asChild
              defaultValue={customValue}
              value={customValue}
              onValueChange={(v) => {
                setCustomValue(v);
                setSearchQuery(v);
              }}
              onKeyDown={(e) => setOpen(e.key !== 'Escape')}
              onMouseDown={() => setOpen((open) => !!value || !open)}
              onFocus={() => setOpen(true)}
              {...fields}
              ref={ref}
            >
              <Input placeholder={placeholder} />
            </CommandPrimitive.Input>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden='true' className='hidden' />}

          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (e.target instanceof Element && e.target.hasAttribute('cmdk-input')) {
                e.preventDefault();
              }
            }}
            className='w-[var(--radix-popover-trigger-width)] p-0'
          >
            <CommandList>
              {items.isPending && (
                <CommandPrimitive.Loading>
                  <div className='p-4 flex justify-center items-center gap-1'>
                    <Loader2 className={'animate-spin'} size={18} /> Loading...
                  </div>
                </CommandPrimitive.Loading>
              )}
              {(opts?.length || 0) > 0 && !items.isPending ? (
                <CommandGroup>
                  {opts?.map(({ label, value, icon: Icon, wrapperFn }) => (
                    <CommandItem
                      key={value}
                      value={value}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={(value) => onSelectItem(value)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedValue === value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {wrapperFn ? (
                        wrapperFn({ label, icon: Icon, value })
                      ) : (
                        <div className={'flex items-center gap-2  justify-between w-full  '}>
                          <span className={'flex items-center gap-2'}>
                            {Icon && <Icon />} {label}
                          </span>
                        </div>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {!items.isPending ? (
                searchQuery ? (
                  fallbackFn ? (
                    fallbackFn(searchQuery)
                  ) : (
                    <CommandEmpty
                      className={buttonVariants({
                        variant: 'secondary',
                        className: 'w-full cursor-pointer',
                      })}
                      onClick={() => {
                        onSelectItem(searchQuery, true);
                      }}
                    >
                      create &quot;{searchQuery}&quot;
                    </CommandEmpty>
                  )
                ) : (
                  <CommandEmpty>Search {fields.label}</CommandEmpty>
                )
              ) : null}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}
