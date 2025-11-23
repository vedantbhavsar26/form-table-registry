import { createQueryKeys } from "@lukemorales/query-key-factory";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { OptionType } from "@/lib/form-field/form-field";

export const useOptionKey = createQueryKeys("select-options", {
	name: (name: string, filter: Record<string, unknown>) => [name, filter],
});
export const useOptionQuery = (
	fn: OptionType | undefined,
	name: string,
	filter?: Record<string, unknown>,
) => {
	return useQuery({
		queryKey: useOptionKey.name(name, { filter, fn: fn?.toString() }).queryKey,
		queryFn: async () => (await fn?.()) || [],
		select: (data) => [...new Set(data)],
		staleTime: 1000 * 60, // 1 minute
		//   previous data stays
		placeholderData: keepPreviousData,
	});
};
