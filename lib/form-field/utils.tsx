import { type ClassValue, clsx } from "clsx";
import type React from "react";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/form-field/ui/button";

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
		type: "change",
	};
}

export const generateFormItems = (
	zodSchema: Record<"shape", Record<string, unknown>>,
	include: {
		form?: boolean;
		button?: boolean;
	},
): ReactNode => {
	const str = () => {
		let str: string = "";
		if (include.form) {
			str += `<Form {...form}>`;
		}
		str = Object.keys(zodSchema.shape).reduce((acc, curr) => {
			acc += `<FormItem control={form.control} name={'${curr}'} label={'${formatToTitleCase(curr)}'} render={'text'} /> `;
			return acc;
		}, "");
		if (include.button) {
			str += `<Button isLoading={DEMO.isPending} type={'submit'} className={cn('w-max col-span-full')}>Submit</Button>`;
		}
		if (include.form) {
			str += `</Form>`;
		}
		return str;
	};

	return (
		<div className={"grid gap-4"}>
			<Button
				type={"button"}
				onClick={() => navigator.clipboard.writeText(str())}
			>
				Copy Form Items
			</Button>
			<pre className={"rounded-md bg-muted/50 p-2"}>
				<code>{JSON.stringify(str(), null, 2)}</code>
			</pre>
		</div>
	);
};

export function formatToTitleCase(input: string): string {
	const words = input
		// Replace underscores with spaces
		.replace(/_/g, " ")
		// Split camelCase by inserting a space before uppercase letters
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.split(" ");

	return words
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}
