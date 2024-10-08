"use client";
import CanvasStore from "../../modules/state/CanvasStore";
import { PointerEvent, useEffect, useMemo, useRef, WheelEvent } from "react";
import useSize from "@react-hook/size";
import InfiniteCanvas from "./InfiniteCanvas";
import useRenderLoop from "../../modules/core/RenderLoop";

const wheelListener = (e: WheelEvent) => {
	const friction = 1;
	const event = e as WheelEvent;
	const deltaX = event.deltaX * friction;
	const deltaY = event.deltaY * friction;
	if (!event.ctrlKey) {
		CanvasStore.moveCamera(deltaX, deltaY);
	} else {
		CanvasStore.zoomCamera(deltaX, deltaY);
	}
};

const pointerListener = (event: PointerEvent) => {
	CanvasStore.movePointer(event.clientX, event.clientY);
};

export type Coordinate = [number, number];

const CanvasRoot = ({
	startingCoordinate,
}: { startingCoordinate: Coordinate }) => {
	const canvas = useRef<HTMLDivElement>(null);
	const [width, height] = useSize(canvas);

	useEffect(() => {
		if (width === 0 || height === 0) return;
		CanvasStore.initialize(width, height);
	}, [width, height]);

	const frame = useRenderLoop(60);

	return (
		<div className="w-full h-full">
			<div
				className="w-full h-full relative overflow-hidden overscroll-none"
				ref={canvas}
				onWheel={wheelListener}
				onPointerMove={pointerListener}
			>
				<InfiniteCanvas frame={frame} startingCoordinate={startingCoordinate} />
			</div>
		</div>
	);
};

export default CanvasRoot;
