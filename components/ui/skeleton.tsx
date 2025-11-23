import { cn } from "@/lib/utils";

function Skeleton({
	className,
	...props
}: React.ComponentProps<"div"> & {
	height?: string | number;
	width?: string | number;
}) {
	return (
		<div
			data-slot="skeleton"
			className={cn("animate-pulse rounded-md bg-accent", className)}
			{...props}
		/>
	);
}

export { Skeleton };
