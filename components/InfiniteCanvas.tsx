import { useCanvasRendering } from "@/app/hooks/useCanvasRendering";
import { useCanvasDrag } from "@/app/hooks/useCanvasDrag";
import { useGridPositions } from "@/app/hooks/useGridPositions";
import { useVideoPool } from "@/app/hooks/useVideoPool";
import React, { useRef, useState } from "react";

const InfiniteCanvas: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const {
		offset,
		isDragging,
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
	} = useCanvasDrag({ x: 0, y: 0 });

	const positions = useGridPositions(offset.x, offset.y)();

	const { getVideoElement, cleanupExcessVideos } = useVideoPool();

	useCanvasRendering(
		canvasRef,
		positions,
		getVideoElement,
		cleanupExcessVideos,
	);

	// const handleScroll = (event: React.WheelEvent<HTMLCanvasElement>) => {
	// 	setOffset((prev) => ({
	// 		x: prev.x + event.deltaX,
	// 		y: prev.y + event.deltaY,
	// 	}));
	// };

	return (
		<canvas
			ref={canvasRef}
			// onWheel={handleScroll}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseUp}
			style={{
				cursor: isDragging ? "grabbing" : "grab",
				border: "1px solid #000",
			}}
		/>
	);
};

export default InfiniteCanvas;
