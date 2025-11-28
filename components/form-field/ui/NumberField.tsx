import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import type { BaseFieldProps } from "@/lib/form-field/form-field";
import { cn } from "@/lib/form-field/utils";

export const NumberField = ({
	withControls = false,
	...field
}: BaseFieldProps & {
	withControls?: boolean;
}) => {
	return (
		<InputGroup
			className={cn(
				"!px-0 relative flex items-center overflow-hidden rounded-md shadow-xs",
				field.className,
			)}
		>
			{withControls && (
				<InputGroupAddon>
					<Button
						variant={"ghost"}
						type={"button"}
						onClick={() => field.onChange(Number(field.value) - 1)}
						size={"sm"}
					>
						<MinusIcon />
					</Button>
				</InputGroupAddon>
			)}
			<InputGroupInput
				{...field}
				type="number"
				className={cn(field.className, {
					"text-center": withControls,
				})}
			/>
			{withControls && (
				<InputGroupAddon align={"inline-end"}>
					<Button
						type={"button"}
						variant={"ghost"}
						size={"sm"}
						onClick={() => field.onChange(Number(field.value) + 1)}
					>
						<PlusIcon />
					</Button>
				</InputGroupAddon>
			)}
		</InputGroup>
	);
};
