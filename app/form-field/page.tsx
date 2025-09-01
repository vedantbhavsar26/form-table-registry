'use client';

import { useForm } from 'react-hook-form';
import { Form } from '@/lib/form-field/form';
import { FormItem } from '@/lib/form-field/formItem';
import { fieldComponents } from '@/lib/form-field/registry';

export function FormPanel() {
  const form = useForm();

  const keys = Object.keys(fieldComponents);

  const options = {
    select: {
      options: async (q) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const opts = [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
          { value: '3', label: 'Option 3' },
          { value: '4', label: 'Option 4' },
          { value: '5', label: 'Option 5' },
          { value: '6', label: 'Option 6' },
          { value: '7', label: 'Option 7' },
        ];
        if (q) return opts.filter((e) => e.label.includes(q));
        return opts;
      },
    },
    combobox: {
      options: async (q) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const opts = [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
          { value: '3', label: 'Option 3' },
          { value: '4', label: 'Option 4' },
          { value: '5', label: 'Option 5' },
          { value: '6', label: 'Option 6' },
          { value: '7', label: 'Option 7' },
        ];
        if (q) return opts.filter((e) => e.label.toLowerCase().includes(q.toLowerCase()));
        return opts;
      },
    },
    suggest: {
      options: async (q) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const opts = [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
          { value: '3', label: 'Option 3' },
          { value: '4', label: 'Option 4' },
          { value: '5', label: 'Option 5' },
          { value: '6', label: 'Option 6' },
          { value: '7', label: 'Option 7' },
        ];
        if (q) return opts.filter((e) => e.label.includes(q));
        return opts;
      },
      shouldCloseOnNoItems: true,
    },
    toggle: {
      options: async (q) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const opts = [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
          { value: '3', label: 'Option 3' },
          { value: '4', label: 'Option 4' },
          { value: '5', label: 'Option 5' },
          { value: '6', label: 'Option 6' },
          { value: '7', label: 'Option 7' },
        ];
        if (q) return opts.filter((e) => e.label.includes(q));
        return opts;
      },
    },
  } satisfies Partial<Record<keyof typeof fieldComponents, Record<string, unknown>>>;

  return (
    <Form {...form} className={'mx-auto container grid grid-cols-3 gap-2 py-20'}>
      {keys.map((key, index) => (
        <FormItem
          key={key}
          control={form.control}
          name={key}
          // @ts-expect-error type error
          render={key}
          props={options[key as never]}
        />
      ))}
    </Form>
  );
}

export default function Page() {
  return (
    <>
      <FormPanel />
    </>
  );
}
