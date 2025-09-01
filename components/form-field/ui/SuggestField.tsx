import { cn } from '@/lib/utils';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, Loader2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { BaseFieldProps, OptionType } from '@/lib/form-field/form-field';
import { useOptionQuery } from '@/hooks/useOptionQuery';
import { createSyntheticInputChange } from '@/lib/form-field/utils';
type Props<T extends string> = BaseFieldProps & {
  selectedValue: T;
  options: OptionType;
  emptyMessage?: string;
  shouldCloseOnNoItems?: boolean;
};

export function SuggestInput<T extends string>({
  selectedValue,
  onChange,
  name,
  value,
  shouldCloseOnNoItems = true,
  options,
  emptyMessage = 'No items.',
  placeholder = 'Search...',
  ...fields
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const items = useOptionQuery(() => options(value), name, { q: value });

  const labels = useMemo(
    () =>
      items.data?.reduce(
        (acc, item) => {
          acc[item.value] = item.label;
          return acc;
        },
        {} as Record<string, string>,
      ),
    [items],
  );

  const onSelectItem = (inputValue: string, isSelecting?: boolean) => {
    onChange(createSyntheticInputChange(name, inputValue));
    if (isSelecting) {
      setOpen(false);
    }
  };

  return (
    <div className='flex items-center'>
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <PopoverAnchor asChild>
            <CommandPrimitive.Input
              asChild
              value={labels?.[value]}
              onValueChange={onSelectItem}
              onKeyDown={(e) => setOpen(e.key !== 'Escape')}
              onMouseDown={() => setOpen((open) => !!value || !open)}
              onFocus={() => setOpen(true)}
              {...fields}
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
              {(items.data?.length || 0) > 0 && !items.isPending ? (
                <CommandGroup>
                  {items.data?.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={(value) => onSelectItem(value, true)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedValue === option.value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {!items.isPending && !shouldCloseOnNoItems ? (
                <CommandEmpty>{emptyMessage ?? 'No items.'}</CommandEmpty>
              ) : null}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}
