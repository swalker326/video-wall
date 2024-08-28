import Link from "next/link";
import Editor from "./modules/editor/Editor";
import { Coordinate } from "./modules/editor/CanvasRoot";
import { gatherCoordinates } from "./modules/editor/coordinateUtils";
import { getCoordinates } from "./server/getCoordinates";
import { Controls } from "@/components/Controls";

const makeCoordinates = (
	xString: string | undefined | string[],
	yString: string | undefined | string[],
) => {
	let x = 0;
	let y = 0;
	if (Array.isArray(xString)) {
		x = 0;
	} else if (xString) {
		x = parseInt(xString);
	}
	if (Array.isArray(yString)) {
		y = 0;
	} else if (yString) {
		y = parseInt(yString);
	}

	const coordinates = [x, y] satisfies Coordinate;
	return coordinates;
};

export default async function Home({
	searchParams,
}: { searchParams: { [key: string]: string | string[] | undefined } }) {
	const coordinates = makeCoordinates(searchParams.x, searchParams.y);
	const surroundingCoordinates = gatherCoordinates(...coordinates, 30);
	const videos = await getCoordinates(surroundingCoordinates);
	console.log("::VIDEOS", videos);

	return (
		<main className="select-none h-full w-full border">
			<Controls />
			<Editor startingCoordinate={coordinates} />
		</main>
	);
}
