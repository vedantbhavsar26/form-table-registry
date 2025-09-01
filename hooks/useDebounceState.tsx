import { useCallback, useState } from 'react';
import { debounce } from 'lodash-es';

export const useDebounceState = <
  T extends string | number | Record<string, unknown> | Array<unknown>,
>(
  initialValue?: T,
  wait: number = 500,
) => {
  const [value, setValue] = useState<T | undefined>(initialValue);
  const handleValueChange = useCallback(debounce(setValue, wait), [wait]);
  return [value, handleValueChange] as const;
};
