"use client";

import {
	Bell,
	Book,
	Calendar,
	Camera,
	Clock,
	Code,
	Cpu,
	CreditCard,
	DollarSign,
	FileText,
	Folder,
	Globe,
	Heart,
	Home,
	Image,
	Lock,
	Mail,
	Music,
	Package,
	Phone,
	Search,
	Settings,
	Shield,
	ShoppingCart,
	Star,
	Truck,
	User,
	Users,
	Video,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "@/hooks/form-field/useForm";
import { Form } from "@/lib/form-field/form";
import type { baseOption, OptionType } from "@/lib/form-field/form-field";
import { FormItem } from "@/lib/form-field/formItem";
import type { fieldComponents } from "@/lib/form-field/registry";

const opts: baseOption[] = [
	{ label: "Home", value: "home", icon: Home },
	{ label: "Profile", value: "profile", icon: User },
	{ label: "Team", value: "team", icon: Users },
	{ label: "Settings", value: "settings", icon: Settings },
	{ label: "Search", value: "search", icon: Search },
	{ label: "Notifications", value: "notifications", icon: Bell },
	{ label: "Messages", value: "messages", icon: Mail },
	{ label: "Calls", value: "calls", icon: Phone },
	{ label: "Calendar", value: "calendar", icon: Calendar },
	{ label: "Time", value: "time", icon: Clock },
	{ label: "Documents", value: "documents", icon: FileText },
	{ label: "Folders", value: "folders", icon: Folder },
	{ label: "Library", value: "library", icon: Book },
	{ label: "Camera", value: "camera", icon: Camera },
	{ label: "Music", value: "music", icon: Music },
	{ label: "Videos", value: "videos", icon: Video },
	{ label: "Images", value: "images", icon: Image },
	{ label: "Map", value: "map", icon: Globe },
	{ label: "World", value: "world", icon: Globe },
	{ label: "Cart", value: "cart", icon: ShoppingCart },
	{ label: "Payments", value: "payments", icon: CreditCard },
	{ label: "Finance", value: "finance", icon: DollarSign },
	{ label: "Inventory", value: "inventory", icon: Package },
	{ label: "Delivery", value: "delivery", icon: Truck },
	{ label: "Favorites", value: "favorites", icon: Heart },
	{ label: "Ratings", value: "ratings", icon: Star },
	{ label: "Security", value: "security", icon: Shield },
	{ label: "Privacy", value: "privacy", icon: Lock },
	{ label: "Hardware", value: "hardware", icon: Cpu },
	{ label: "Code", value: "code", icon: Code },
].map((e) => ({ ...e, count: Math.floor(Math.random() * 100) }));

export function FormPanel() {
	const form = useForm(
		z.object({
			text: z.string(),
			number: z.string(),
			boolean: z.string(),
			suffix: z.string(),
			file: z.string(),
			select: z.string(),
			textArea: z.string(),
			suggest: z.string(),
			dateTime: z.string(),
			combobox: z.string(),
			toggle: z.string(),
			currency: z.string(),
			password: z.string(),
		}),
	);

	const options = {
		select: {
			options: async (q) => {
				await new Promise((resolve) => setTimeout(resolve, 100));
				if (q) return opts.filter((e) => e.label.includes(q));
				return opts;
			},
		},
		combobox: {
			options: async (q) => {
				await new Promise((resolve) => setTimeout(resolve, 100));
				if (q)
					return opts.filter((e) =>
						e.label.toLowerCase().startsWith(q.toLowerCase()),
					);
				return [];
			},
		},
		suggest: {
			options: async (q) => {
				await new Promise((resolve) => setTimeout(resolve, 100));
				if (q)
					return opts.filter((e) =>
						e.label.toLowerCase().startsWith(q.toLowerCase()),
					);
				return [];
			},
			shouldCloseOnNoItems: true,
		},
		toggle: {
			options: async (q) => {
				await new Promise((resolve) => setTimeout(resolve, 100));
				if (q) return opts.filter((e) => e.label.includes(q));
				return opts;
			},
		},
	} satisfies Partial<
		Record<
			keyof typeof fieldComponents,
			{
				options: OptionType;
				shouldCloseOnNoItems?: boolean;
			}
		>
	>;

	return (
		<Form {...form} className={"container grid grid-cols-3 gap-8 py-20"}>
			<FormItem
				control={form.control}
				name={"text"}
				label={"Text"}
				render={"text"}
			/>{" "}
			<FormItem
				control={form.control}
				name={"number"}
				label={"Number"}
				render={"number"}
			/>{" "}
			<FormItem
				control={form.control}
				name={"boolean"}
				label={"Boolean"}
				render={"boolean"}
			/>{" "}
			<FormItem
				control={form.control}
				name={"suffix"}
				label={"Suffix"}
				render={"suffix"}
			/>{" "}
			<FormItem
				control={form.control}
				name={"file"}
				label={"File"}
				render={"file"}
			/>{" "}
			<FormItem
				control={form.control}
				name={"select"}
				label={"Select"}
				render={"select"}
				props={options.select}
			/>{" "}
			<FormItem
				control={form.control}
				name={"textArea"}
				label={"Text Area"}
				render={"textArea"}
			/>{" "}
			<FormItem
				control={form.control}
				name={"suggest"}
				label={"Suggest"}
				render={"suggest"}
				props={{ options: () => opts }}
			/>{" "}
			<FormItem
				control={form.control}
				name={"dateTime"}
				label={"Date Time"}
				render={"dateTime"}
			/>{" "}
			<FormItem
				control={form.control}
				name={"combobox"}
				label={"Combobox"}
				render={"combobox"}
				props={{ options: () => opts }}
			/>{" "}
			<FormItem
				control={form.control}
				name={"toggle"}
				label={"Toggle"}
				render={"toggle"}
				props={{ options: () => opts }}
			/>{" "}
			<FormItem
				control={form.control}
				name={"currency"}
				label={"Currency"}
				render={"currency"}
			/>{" "}
			<FormItem
				control={form.control}
				name={"password"}
				label={"Password"}
				render={"password"}
			/>{" "}
		</Form>
	);
}

export default function Page() {
	return <FormPanel />;
}
