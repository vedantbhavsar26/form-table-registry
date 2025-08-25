import { useQuery } from '@tanstack/react-query';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import { OptionType } from '@/lib/form-field/form-field';

export const useOptionKey = createQueryKeys('select-options', {
  name: (name: string, filter: Record<string, unknown>) => [name, filter],
});
export const useOptionQuery = (
  fn: OptionType | undefined,
  name: string,
  filter?: Record<string, unknown>,
) => {
  return useQuery({
    queryKey: useOptionKey.name(name, filter || {}).queryKey,
    queryFn: async () => (await fn?.()) || [],
    // remove duplicates
    select: (data) => [...new Set(data)],
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
