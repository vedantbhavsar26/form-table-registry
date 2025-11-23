import Link from "next/link";
import { buttonVariants } from "@/components/form-field/ui/button";
import { registryUi } from "@/src/registry/registry-ui";

export default function Home() {
	return (
		<div className={"container mx-auto grid gap-4 py-20"}>
			<h2>List</h2>
			{registryUi.map((e) => (
				<Link
					href={`/r/${e.name}.json`}
					className={buttonVariants({ variant: "default" })}
					key={e.name}
				>
					{e.title}
				</Link>
			))}

			<Link
				href={"/form-field"}
				className={buttonVariants({ variant: "default" })}
			>
				Form Field Example
			</Link>
			<Link
				href={"/data-table"}
				className={buttonVariants({ variant: "default" })}
			>
				Data table Example
			</Link>
		</div>
	);
}
