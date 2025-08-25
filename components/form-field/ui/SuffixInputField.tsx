import React, { ReactNode, useId } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/data-table/utils';

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
    <div className='relative z-10 flex rounded-md shadow-xs'>
      <span className='text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm'>
        {prefix}
      </span>
      <Input
        id={id}
        className='-me-px rounded-e-none ps-6 shadow-none'
        type={type}
        placeholder='0.00'
        {...props}
      />
      <span
        className={cn(
          'text-muted-foreground border-input -z-10 inline-flex items-center rounded-e-md border text-sm',
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
