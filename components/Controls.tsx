import Link from "next/link";

export function Controls() {
	return (
		<div className="absolute inset-x-0 bg-gray-200 z-10">
			<Link href="/create">Claim Your Spot</Link>
		</div>
	);
}
