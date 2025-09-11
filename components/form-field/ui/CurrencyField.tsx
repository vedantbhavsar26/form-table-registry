import React, { useState } from 'react';
import { BaseFieldProps } from '@/lib/form-field/form-field';
import { createSyntheticInputChange } from '@/lib/form-field/utils';
import { Input } from '@/components/ui/input';

const moneyFormatter = Intl.NumberFormat('en-IN', {
  currency: 'INR',
  style: 'currency',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const CurrencyField: React.FC<BaseFieldProps> = ({ ...field }) => {
  const [displayValue, setDisplayValue] = useState<string>(
    field.value ? moneyFormatter.format(Number(field.value)) : '',
  );

  function parseToNumber(input: string): number | null {
    // allow decimals directly, don’t force paise
    const clean = input.replace(/[^0-9.]/g, '');
    if (!clean) return null;
    return Number(clean);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let raw = e.target.value;

    // Strip everything except digits and .
    raw = raw.replace(/[^0-9.]/g, '');

    // Prevent multiple decimals (keep only the first)
    const parts = raw.split('.');
    if (parts.length > 2) {
      raw = parts[0] + '.' + parts.slice(1).join('');
    }

    setDisplayValue(raw);

    const parsed = parseToNumber(raw);
    field.onChange(createSyntheticInputChange(field.name, parsed ?? ''));
  }

  function handleBlur() {
    field.onBlur();
    const parsed = parseToNumber(displayValue);
    if (parsed !== null && !isNaN(parsed)) {
      setDisplayValue(moneyFormatter.format(parsed));
    } else {
      setDisplayValue('');
    }
  }

  function handleFocus() {
    // strip formatting so user edits raw value
    const parsed = parseToNumber(displayValue);
    if (parsed !== null && !isNaN(parsed)) {
      setDisplayValue(String(parsed));
    }
  }

  return (
    <Input
      type='text'
      inputMode='decimal'
      pattern='[0-9]*'
      {...field}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  );
};
