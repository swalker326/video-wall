"use client";
import Link from "next/link";
import Editor from "./modules/editor/Editor";

export default function Home() {
	return (
		<main className="select-none h-full w-full border">
			<div className="absolute inset-x-0 bg-gray-200 z-10">
				<h2 className="text-2xl">Controls</h2>
				<Link href="/another-route">Home</Link>
			</div>
			<Editor />
		</main>
	);
}
