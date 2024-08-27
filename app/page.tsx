"use client";
import InfiniteCanvas from "@/components/InfiniteCanvas";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
	useEffect(() => {
		console.log("Component mounting");
		return () => {
			console.log("Component unmounting");
		};
	}, []);
	return (
		<main className="flex flex-col">
			<div className="absolute inset-x-0 bg-gray-200">
				<h2 className="text-2xl">Controls</h2>
				<Link href="/another-route">Home</Link>
			</div>
			<InfiniteCanvas />
		</main>
	);
}
