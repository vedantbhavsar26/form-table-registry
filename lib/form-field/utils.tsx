import React, { ReactNode } from 'react';
import { Button } from '@/components/form-field/ui/button';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createSyntheticInputChange(
  name: string,
  value: unknown,
): React.ChangeEvent<HTMLInputElement> {
  const target = {
    name,
    value,
  } as EventTarget & HTMLInputElement;

  return {
    target,
    currentTarget: target,
    bubbles: true,
    cancelable: true,
    defaultPrevented: false,
    eventPhase: 3,
    isTrusted: true,
    nativeEvent: {} as Event,
    preventDefault: () => {},
    isDefaultPrevented: () => false,
    stopPropagation: () => {},
    isPropagationStopped: () => false,
    persist: () => {},
    timeStamp: Date.now(),
    type: 'change',
  };
}

export const generateZodJSX = (zodSchema: Record<'shape', Record<string, unknown>>): ReactNode => {
  const str = () => {
    const str = Object.keys(zodSchema.shape).reduce((acc, curr) => {
      acc += `<FormItem control={form.control} name={'${curr}'} label={'${formatToTitleCase(curr)}'} render={'text'} />`;
      return acc;
    }, '');
    return str;
  };

  return <Button onClick={() => navigator.clipboard.writeText(str())}>Copy Zod JSX</Button>;
};

export function formatToTitleCase(input: string): string {
  const words = input
    // Replace underscores with spaces
    .replace(/_/g, ' ')
    // Split camelCase by inserting a space before uppercase letters
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ');

  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}
