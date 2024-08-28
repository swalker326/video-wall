"use client";
import CanvasRoot, { type Coordinate } from "./CanvasRoot";

const Editor = ({ startingCoordinate }: { startingCoordinate: Coordinate }) => {
	return (
		<div className="w-full h-full">
			<CanvasRoot startingCoordinate={startingCoordinate} />
		</div>
	);
};

export default Editor;
