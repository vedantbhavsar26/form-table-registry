import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { BaseFieldProps } from "@/lib/form-field/form-field";
import { createSyntheticInputChange } from "@/lib/form-field/utils";

const moneyFormatter = Intl.NumberFormat("en-IN", {
	currency: "INR",
	style: "currency",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

export const CurrencyField: React.FC<BaseFieldProps> = ({ ...field }) => {
	const [displayValue, setDisplayValue] = useState<string>(
		field.value ? moneyFormatter.format(Number(field.value)) : "",
	);

	function parseToNumber(input: string): number | null {
		// allow decimals directly, don't force paise
		const clean = input.replace(/[^0-9.-]/g, "");
		if (!clean) return null;
		return Number(clean);
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const raw = e.target.value;
		setDisplayValue(raw); // show what user typed

		const parsed = parseToNumber(raw);
		field.onChange(createSyntheticInputChange(field.name, parsed ?? "")); // keep form state updated live
	}

	function handleBlur() {
		field.onBlur();
		const parsed = parseToNumber(displayValue);
		if (parsed !== null && !Number.isNaN(parsed)) {
			setDisplayValue(moneyFormatter.format(parsed));
		} else {
			setDisplayValue("");
		}
	}

	function handleFocus() {
		// strip formatting so user edits raw value
		const parsed = parseToNumber(displayValue);
		if (parsed !== null && !Number.isNaN(parsed)) {
			setDisplayValue(String(parsed));
		}
	}

	return (
		<Input
			type="text"
			inputMode="decimal"
			{...field}
			value={displayValue}
			onChange={handleChange}
			onBlur={handleBlur}
			onFocus={handleFocus}
		/>
	);
};
