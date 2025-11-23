"use client";
import { Button } from "@/components/ui/button";

export function ThemeChange() {
	const toggleTheme = (theme: "dark" | "light") => {
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	};
	return (
		<div className={"absolute top-2 right-2"}>
			<Button onClick={() => toggleTheme("dark")}>Dark Mode</Button>
			<Button onClick={() => toggleTheme("light")}>Light Mode</Button>
		</div>
	);
}
