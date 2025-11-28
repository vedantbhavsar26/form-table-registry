import React from "react";
import { Switch } from "@/components/ui/switch";
import type { BaseFieldProps } from "@/lib/form-field/form-field";

export default function SwitchField(props: BaseFieldProps) {
	return <Switch {...props} />;
}
