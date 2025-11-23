import ImageDropZone from "@/components/form-field/ui/ImageDropZone";
import type { BaseFieldProps } from "@/lib/form-field/form-field";

export const FileField = ({
	display = "COMPACT",
	...field
}: BaseFieldProps & {
	multiple?: boolean;
	accept?: string;
	display?: "COMPACT" | "FULL";
}) => {
	return (
		<ImageDropZone
			{...field}
			accept={field.accept}
			multiple={field.multiple}
			display={display}
		/>
	);
};
