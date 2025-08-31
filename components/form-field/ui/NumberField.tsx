import React from 'react';
import { Input } from '@/components/ui/input';
import { BaseFieldProps } from '@/lib/form-field/form-field';
import { cn } from '@/lib/form-field/utils';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon } from 'lucide-react';

export const NumberField = ({
  withControls = false,
  ...field
}: BaseFieldProps & {
  withControls?: boolean;
}) => {
  return (
    <div className='relative z-10 flex items-center rounded-md shadow-xs'>
      {withControls && (
        <Button
          variant={'ghost'}
          type={'button'}
          onClick={() => field.onChange(Number(field.value) - 1)}
          size={'sm'}
          className='text-muted-foreground  absolute inset-y-0 start-0 mr-2 flex h-full items-center justify-center ps-3 text-sm'
        >
          <MinusIcon />
        </Button>
      )}
      <Input
        {...field}
        type='number'
        className={cn({
          '-me-px h-full min-h-9 rounded-e-none ps-10 shadow-none text-center ': withControls,
        })}
      />
      {withControls && (
        <Button
          type={'button'}
          variant={'ghost'}
          size={'sm'}
          onClick={() => field.onChange(Number(field.value) + 1)}
          className={cn(
            'text-muted-foreground  absolute inset-y-0 end-0  flex h-full items-center justify-center  text-sm',
            {
              'opacity-50': field.disabled,
            },
          )}
        >
          <PlusIcon />
        </Button>
      )}
    </div>
  );
};
