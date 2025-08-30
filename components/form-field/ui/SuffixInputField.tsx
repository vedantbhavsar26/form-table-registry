import React, { ReactNode, useId } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/form-field/utils';

export default function SuffixInputField({
  prefix = '₹',
  suffix = 'INR',
  type = 'number',
  ...props
}: React.ComponentProps<'input'> & {
  prefix?: string;
  suffix?: ReactNode;
  type?: 'number' | 'text';
}) {
  const id = useId();
  const isDisabled = props.disabled || props.readOnly;
  return (
    <div className='relative z-10 flex items-center rounded-md shadow-xs'>
      <span className='text-muted-foreground pointer-events-none absolute inset-y-0 start-0 mr-2 flex h-full items-center justify-center ps-3 text-sm'>
        {prefix}
      </span>
      <Input
        id={id}
        className='-me-px h-full min-h-9 rounded-e-none ps-8 shadow-none'
        type={type}
        placeholder='0.00'
        {...props}
      />
      <span
        className={cn(
          'text-muted-foreground border-input -z-10 inline-flex h-full w-max items-center rounded-e-md border text-sm whitespace-nowrap',
          {
            'opacity-50': isDisabled,
            'bg-secondary px-3': typeof suffix === 'string',
          },
        )}
      >
        {suffix}
      </span>
    </div>
  );
}
