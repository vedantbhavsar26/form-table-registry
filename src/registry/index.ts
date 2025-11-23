import type { Registry } from "shadcn/registry";
import { registryUi } from "./registry-ui";

export const registry = {
	name: "vedantbhavsar.com",
	homepage: "https://vedantbhavsar.com",
	items: [...registryUi],
} satisfies Registry;
