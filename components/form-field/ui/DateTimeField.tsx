'use client';

import { Input } from '@/components/ui/input';
import React, { useId, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ChevronDownIcon, ClockIcon } from 'lucide-react';
import { Button } from '@/components/form-field/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { BaseFieldProps } from '@/lib/form-field/form-field';
import { createSyntheticInputChange } from '@/lib/form-field/utils';
import { cn } from '@/lib/utils';

export const DateTimeField: React.FC<
  BaseFieldProps & {
    display?: 'date' | 'time' | 'datetime';
  }
> = ({ display = 'datetime', ...field }) => {
  const id = useId();
  const [date, setDate] = useState<Date | undefined>(field.value);
  const shouldDisplayTime = display === 'time' || display === 'datetime';
  const shouldDisplayDate = display === 'date' || display === 'datetime';
  return (
    <div className='flex w-full gap-1'>
      {shouldDisplayDate && (
        <div className='flex flex-1 flex-col gap-3'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='ghost'
                id='date-picker'
                className={cn(
                  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input bg-secondary w-full justify-between border font-normal',
                  field.className,
                )}
              >
                {date ? format(date, 'PPP') : field.placeholder || 'Select date'}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
              <Calendar
                mode='single'
                selected={date}
                captionLayout='dropdown'
                onSelect={(date) => {
                  if (!date) return;
                  setDate(date);
                  field.onChange(createSyntheticInputChange(field.name, new Date(date).toString()));
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
      {shouldDisplayTime && (
        <div className={cn('flex flex-1 flex-col gap-3 rounded-md', field.className)}>
          <div className='relative grow'>
            <Input
              id={id}
              type='time'
              step='1'
              defaultValue='12:00:00'
              onChange={(e) => {
                const timeValue = e.target.value;
                const [hours, minutes, seconds] = timeValue.split(':').map(Number);
                const newDate = new Date(date || new Date());
                newDate.setHours(hours, minutes, seconds);
                setDate(newDate);
                field.onChange(
                  createSyntheticInputChange(field.name, new Date(newDate).toString()),
                );
              }}
              className='peer appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
            />
            <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
              <ClockIcon size={16} aria-hidden='true' />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
