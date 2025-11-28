"use client";

import { PopoverClose } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { ChevronDownIcon, ClockIcon } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/form-field/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { BaseFieldProps } from "@/lib/form-field/form-field";
import { createSyntheticInputChange } from "@/lib/form-field/utils";
import { cn } from "@/lib/form-field/utils";

const parseDate = (val: unknown): Date | undefined => {
	if (!val && val !== 0) return undefined;
	if (val instanceof Date) return val;
	const d = new Date(String(val));
	return isNaN(d.getTime()) ? undefined : d;
};

export const DateTimeField: React.FC<
	BaseFieldProps & {
		display?: "date" | "time" | "datetime";
	}
> = ({ display = "datetime", ...field }) => {
	// helper to parse/normalize incoming prop value

	const [date, setDate] = useState<Date | undefined>(() =>
		parseDate(field.value),
	);
	const popoverCloseRef = useRef<HTMLButtonElement | null>(null);

	// keep internal state in sync when parent updates value
	useEffect(() => {
		setDate(parseDate(field.value));
	}, [field.value]);

	const shouldDisplayTime = display === "time" || display === "datetime";
	const shouldDisplayDate = display === "date" || display === "datetime";
	return (
		<div className="flex w-full gap-1">
			{shouldDisplayDate && (
				<div className="flex flex-1 flex-col gap-3">
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="ghost"
								id="date-picker"
								className={cn(
									"w-full justify-between border border-input bg-secondary font-normal selection:bg-primary selection:text-primary-foreground file:text-foreground placeholder:text-muted-foreground dark:bg-input/30",
									field.className,
									{
										// use internal date state to determine muted styling
										"text-muted-foreground": !date,
									},
								)}
							>
								{date
									? format(date, "PPP")
									: field.placeholder || "Select date"}
								<ChevronDownIcon />
							</Button>
						</PopoverTrigger>
						<PopoverClose ref={popoverCloseRef} hidden={true} />
						<PopoverContent
							className="w-auto overflow-hidden p-0"
							align="start"
						>
							<Calendar
								mode="single"
								selected={date}
								captionLayout="dropdown"
								onSelect={(selected) => {
									if (!selected) return;
									setDate(selected);
									popoverCloseRef.current?.click();
									field.onChange(
										createSyntheticInputChange(
											field.name,
											selected.toISOString(),
										),
									);
								}}
							/>
						</PopoverContent>
					</Popover>
				</div>
			)}
			{shouldDisplayTime && (
				<div
					className={cn(
						"flex flex-1 flex-col gap-3 rounded-md",
						field.className,
						{
							// use internal date state to determine muted styling
							"text-muted-foreground": !date,
						},
					)}
				>
					<div className="relative grow">
						<Input
							id={field.name}
							type="time"
							step="1"
							// make the time input controlled so it reflects external updates
							value={date ? format(date, "HH:mm:ss") : ""}
							onChange={(e) => {
								const timeValue = e.target.value;
								if (!timeValue) {
									// clear time -> clear date state / notify parent with empty value
									setDate(undefined);
									field.onChange(createSyntheticInputChange(field.name, ""));
									return;
								}
								const parts = timeValue.split(":").map(Number);
								const [hours = 0, minutes = 0, seconds = 0] = parts;
								const newDate = new Date(date || Date.now());
								newDate.setHours(hours, minutes, seconds);
								setDate(newDate);
								field.onChange(
									createSyntheticInputChange(field.name, newDate.toISOString()),
								);
							}}
							className="peer appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
						/>
						<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
							<ClockIcon size={16} aria-hidden="true" />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
