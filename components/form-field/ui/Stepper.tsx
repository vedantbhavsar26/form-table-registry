import { useMutation } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { type JSX, useEffect, useState } from "react";
import { Button, type buttonVariants } from "@/components/form-field/ui/button";
import { cn } from "@/lib/data-table/utils";

export default function Stepper({
	onIncrement,
	onDecrement,
	defaultValue = 0,
	min = Number.NEGATIVE_INFINITY,
	max = Number.POSITIVE_INFINITY,
	defaultDecrementIcon = <Minus size={16} aria-hidden="true" />,
	defaultIncrementIcon = <Plus size={16} aria-hidden="true" />,
	className,
	buttonVariant,
}: {
	onIncrement: (number: number) => Promise<void>;
	onDecrement: (number: number) => Promise<void>;
	defaultValue?: number;
	max?: number;
	min?: number;
	defaultDecrementIcon?: JSX.Element;
	defaultIncrementIcon?: JSX.Element;
	className?: string;
	buttonVariant?: typeof buttonVariants;
}) {
	const [value, setValue] = useState<number>(defaultValue);
	useEffect(() => {
		setValue(defaultValue);
	}, [defaultValue]);
	const onIncrementMutation = useMutation({
		mutationFn: () => {
			const newValue = Math.min(max, value + 1);
			setValue(newValue);
			return onIncrement(newValue);
		},
	});
	const onDecrementMutation = useMutation({
		mutationFn: () => {
			const newValue = Math.max(min, value - 1);
			setValue(newValue);
			return onDecrement(newValue);
		},
	});

	return (
		<div className="-space-x-px inline-flex rounded-full shadow-xs rtl:space-x-reverse">
			<Button
				isLoading={onDecrementMutation.isPending}
				onClick={() => onDecrementMutation.mutate()}
				disabled={value <= min}
				{...buttonVariant}
				className={cn(
					"rounded-none shadow-none first:rounded-s-full last:rounded-e-full focus-visible:z-10",
					className,
				)}
				size="icon"
				aria-label="Upvote"
				icon={defaultDecrementIcon}
			/>
			<span className="flex items-center bg-primary px-1 font-medium text-primary-foreground text-sm">
				{value}
			</span>
			<Button
				isLoading={onIncrementMutation.isPending}
				onClick={() => onIncrementMutation.mutate()}
				disabled={value >= max}
				{...buttonVariant}
				className={cn(
					"rounded-none shadow-none first:rounded-s-full last:rounded-e-full focus-visible:z-10",
					className,
				)}
				size="icon"
				aria-label="Downvote"
				icon={defaultIncrementIcon}
			/>
		</div>
	);
}
