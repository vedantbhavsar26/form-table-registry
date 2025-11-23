"use client";
import { type PropsWithChildren, Suspense } from "react";

export default function Layout(props: PropsWithChildren) {
	return <Suspense fallback={"Loading"}>{props.children}</Suspense>;
}
