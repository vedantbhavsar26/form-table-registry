import React, { useEffect, useState } from 'react';
import { Popover as ShadcnPopover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type PopoverProps = {
  trigger: React.ReactNode | string;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
  defaultOpen?: boolean;
  className?: {
    trigger?: string;
    content?: string;
  };
  align?: 'start' | 'end' | 'center';
};
export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  defaultOpen,
  className,
  align,
}) => {
  const [open, setOpen] = useState<boolean>(defaultOpen || false);

  useEffect(() => {
    return () => setOpen(false);
  }, []);
  return (
    <ShadcnPopover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild={typeof trigger !== 'string'} className={cn(className?.trigger)}>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className={cn(className?.content)} align={align}>
        {typeof children === 'function' ? children(() => setOpen(false)) : children}
      </PopoverContent>
    </ShadcnPopover>
  );
};
