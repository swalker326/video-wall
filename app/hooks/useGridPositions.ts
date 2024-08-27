import { VIDEO_SIZE, MARGIN, GRID_SPAN } from "@/app/constants";
import { useCallback } from "react";

export const useGridPositions = (offsetX: number, offsetY: number) => {
	return useCallback(() => {
		// Adjusting to ensure the grid starts at a positive y-coordinate
		const startCol = Math.floor(offsetX / (VIDEO_SIZE + MARGIN)) - GRID_SPAN;
		const endCol = Math.floor(offsetX / (VIDEO_SIZE + MARGIN)) + GRID_SPAN;
		const startRow = Math.max(
			Math.floor(offsetY / (VIDEO_SIZE + MARGIN)) - GRID_SPAN,
			0,
		);
		const endRow = Math.floor(offsetY / (VIDEO_SIZE + MARGIN)) + GRID_SPAN;

		const positions = [];
		for (let row = startRow; row <= endRow; row++) {
			for (let col = startCol; col <= endCol; col++) {
				positions.push({
					x: col * (VIDEO_SIZE + MARGIN),
					y: row * (VIDEO_SIZE + MARGIN),
				});
			}
		}
		console.log("Grid Positions Calculated:", positions);
		return positions;
	}, [offsetX, offsetY]);
};
