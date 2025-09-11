import { cn } from '@/lib/utils';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, Loader2 } from 'lucide-react';
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
  BaseFieldProps,
  baseOption,
  OptionType,
} from '@/lib/form-field/form-field';
import { useOptionQuery } from '@/hooks/useOptionQuery';
import { createSyntheticInputChange } from '@/lib/form-field/utils';
import { buttonVariants } from '@/components/form-field/ui/button';
import { useDebounceState } from '@/hooks/useDebounceState';

type Props = BaseFieldProps & {
  id?: string;
  options: OptionType;
  fallbackFn?: (
    value: string,
    onSelectItem: (opt: { label: string; value: string }) => void,
  ) => ReactNode;
  getInitialValue?: (value: string) => Promise<baseOption | undefined>;
};

export function SuggestInput({
  onChange,
  name,
  value,
  options,
  fallbackFn,
  placeholder = 'Search...',
  getInitialValue,
  id = name,
  ...fields
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useDebounceState<string>(value);
  const items = useOptionQuery(() => options(searchQuery), id, {
    q: searchQuery,
  });
  const [customOptions, setCustomOptions] = useState<baseOption[]>([]);

  useEffect(() => {
    if (value) {
      getInitialValue?.(value).then((opt) => {
        if (opt) {
          setCustomOptions((value) => [opt, ...value]);
          setCustomValue(opt.label);
        }
      });
    }
  }, []);

  const ref = useRef<HTMLInputElement>(null);

  const opts = useMemo(
    () =>
      [...customOptions, ...(items.data || [])]
        .filter(
          (e) =>
            e.label
              .toLowerCase()
              .startsWith(searchQuery?.toLowerCase() || '') ||
            e.value.toLowerCase() === value,
        )
        .reduce<baseOption[]>((acc, item) => {
          const existing = acc.find((e) => e.value === item.value);
          if (existing) {
            existing.label = item.label;
          } else {
            acc.push(item);
          }
          return acc;
        }, []),
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

  const onSelectItem = (
    opt: { label: string; value: string },
    isNew: boolean = false,
  ) => {
    onChange(createSyntheticInputChange(name, opt.value));
    if (isNew) {
      setCustomOptions((prev) => [...prev, opt]);
      setCustomValue(opt.value);
    } else {
      setCustomValue(labels?.[opt.value]);
    }
    setOpen(false);
  };

  return (
    <div className='flex items-center bg-transparent'>
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false} className={'bg-transparent'}>
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
              if (
                e.target instanceof Element &&
                e.target.hasAttribute('cmdk-input')
              ) {
                e.preventDefault();
              }
            }}
            className='w-[var(--radix-popover-trigger-width)] p-0'
          >
            <CommandList>
              {items.isPending && (
                <CommandPrimitive.Loading>
                  <div className='flex items-center justify-center gap-1 p-4'>
                    <Loader2 className={'animate-spin'} size={18} /> Loading...
                  </div>
                </CommandPrimitive.Loading>
              )}
              {(opts?.length || 0) > 0 && !items.isPending ? (
                <CommandGroup>
                  {opts?.map(
                    ({ label, value: optValue, icon: Icon, wrapperFn }) => (
                      <CommandItem
                        key={optValue}
                        value={optValue}
                        onMouseDown={(e) => e.preventDefault()}
                        onSelect={(s_v) =>
                          onSelectItem({ label: s_v, value: optValue })
                        }
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === optValue ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        {wrapperFn ? (
                          wrapperFn({ label, icon: Icon, value: optValue })
                        ) : (
                          <div
                            className={
                              'flex w-full items-center justify-between gap-2'
                            }
                          >
                            <span className={'flex items-center gap-2'}>
                              {Icon && <Icon />} {label}
                            </span>
                          </div>
                        )}
                      </CommandItem>
                    ),
                  )}
                </CommandGroup>
              ) : null}
              {!items.isPending ? (
                searchQuery ? (
                  fallbackFn ? (
                    <CommandEmpty className={'!p-0'}>
                      {fallbackFn(searchQuery, onSelectItem)}
                    </CommandEmpty>
                  ) : (
                    <CommandEmpty
                      className={buttonVariants({
                        variant: 'secondary',
                        className: 'w-full cursor-pointer',
                      })}
                      onClick={() => {
                        onSelectItem(
                          {
                            label: searchQuery,
                            value: searchQuery,
                          },
                          true,
                        );
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
