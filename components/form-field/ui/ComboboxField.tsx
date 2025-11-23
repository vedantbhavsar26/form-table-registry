import { CommandLoading } from "cmdk";
import { debounce } from "lodash-es";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { FormControl } from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useOptionQuery } from "@/hooks/useOptionQuery";
import type {
	BaseFieldProps,
	baseOption,
	Options,
} from "@/lib/form-field/form-field";
import { cn, createSyntheticInputChange } from "@/lib/form-field/utils";

export const ComboboxField: React.FC<
	BaseFieldProps & {
		options: (searchQuery: string | undefined) => Options;
		noResultFallBack?: React.ReactNode;
		getInitialValue?: (value: string) => Promise<baseOption | undefined>;
	}
> = ({
	noResultFallBack = "No Result found.",
	options: optionFn,
	getInitialValue,
	...field
}) => {
	const [searchQuery, setSearchQuery] = useState<string>();
	const [customOptions, setCustomOptions] = useState<baseOption[]>([]);
	const [open, setOpen] = useState(false);
	const initialLoadRef = useRef(false);

	const optionsQuery = useOptionQuery(() => optionFn(searchQuery), field.name, {
		q: searchQuery,
	});

	// Memoize debounced function to prevent recreation
	const debouncedSetSearchQuery = useMemo(
		() => debounce((value: string) => setSearchQuery(value), 500),
		[],
	);

	// Cleanup debounce on unmount
	useEffect(() => {
		return () => {
			debouncedSetSearchQuery.cancel();
		};
	}, [debouncedSetSearchQuery]);

	// Load initial value only once
	useEffect(() => {
		if (!field.value || !getInitialValue || initialLoadRef.current) return;

		initialLoadRef.current = true;

		getInitialValue(field.value).then((opt) => {
			if (opt?.value) {
				field.onChange(createSyntheticInputChange(field.name, opt.value));
				setCustomOptions((prev) => {
					// Avoid duplicates
					const exists = prev.some((o) => o.value === opt.value);
					return exists ? prev : [opt, ...prev];
				});
			} else {
				field.onChange(null);
			}
		});
	}, [field.value, getInitialValue, field.name]);

	// Memoize combined options
	const options = useMemo(
		() => customOptions.concat(optionsQuery.data || []),
		[customOptions, optionsQuery.data],
	);

	// Memoize selected value
	const selectedOption = useMemo(
		() =>
			field.value
				? options.find((opt) => opt.value === field.value)
				: undefined,
		[field.value, options],
	);

	// Memoize handlers
	const handleSelect = useCallback(
		(value: string) => {
			setOpen(false);
			field.onChange(createSyntheticInputChange(field.name, value));
		},
		[field.name, field.onChange],
	);

	const handleOpenChange = useCallback((isOpen: boolean) => {
		setOpen(isOpen);
	}, []);

	return (
		<div className="relative">
			<Popover open={open} onOpenChange={handleOpenChange}>
				<PopoverTrigger asChild>
					<FormControl className="w-full">
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							className={cn(
								"justify-between",
								field.className,
								!field.value && "text-muted-foreground",
							)}
						>
							{selectedOption?.label || (
								<span className="text-muted-foreground max-w-32 truncate">
									Select {field.label}
								</span>
							)}
							<ChevronsUpDown className="opacity-50" />
						</Button>
					</FormControl>
				</PopoverTrigger>
				<PopoverContent
					className="w-[var(--radix-popover-trigger-width)] p-0"
					align="center"
				>
					<Command>
						<CommandInput
							placeholder={field.placeholder}
							className="h-9"
							onValueChange={debouncedSetSearchQuery}
						/>
						<CommandList>
							{optionsQuery.isPending && (
								<CommandLoading>
									<div className="flex items-center justify-center py-4">
										<Loader2 className="animate-spin" />
									</div>
								</CommandLoading>
							)}
							{!optionsQuery.isPending && options.length === 0 && (
								<CommandEmpty>{noResultFallBack}</CommandEmpty>
							)}

							{options.length > 0 && (
								<CommandGroup>
									{options.map(({ label, value, icon: Icon, wrapperFn }) => (
										<CommandItem
											value={label}
											key={value}
											className="*:w-full"
											onSelect={() => handleSelect(value)}
										>
											{wrapperFn ? (
												wrapperFn({ label, icon: Icon, value })
											) : (
												<div className="flex w-full items-center justify-between gap-2">
													<span className="flex items-center gap-2">
														{Icon && <Icon />} {label}
													</span>
												</div>
											)}
											<Check
												className={cn(
													"ml-auto",
													value === field.value ? "opacity-100" : "opacity-0",
												)}
											/>
										</CommandItem>
									))}
								</CommandGroup>
							)}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
};
