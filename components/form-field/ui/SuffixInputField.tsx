import type React from "react";
import { type ReactNode, useId } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/form-field/utils";

export default function SuffixInputField({
	prefix = "₹",
	suffix = "INR",
	type = "number",
	className,
	...props
}: React.ComponentProps<"input"> & {
	prefix?: string;
	suffix?: ReactNode;
	type?: "number" | "text";
}) {
	const id = useId();
	return (
		<InputGroup
			className={cn(
				className,
				"relative z-10 flex items-center rounded-md shadow-xs",
			)}
		>
			<InputGroupAddon>{prefix}</InputGroupAddon>
			<InputGroupInput id={id} type={type} placeholder="0.00" {...props} />
			<InputGroupAddon align={"inline-end"}>{suffix}</InputGroupAddon>
		</InputGroup>
	);
}
