import { useState, useCallback } from "react";

export const useCanvasZoom = (initialZoom = 1, minZoom = 0.1, maxZoom = 10) => {
	const [zoom, setZoom] = useState<number>(initialZoom);

	const handleZoom = useCallback(
		(event: React.WheelEvent<HTMLCanvasElement>) => {
			event.preventDefault();
			const zoomSpeed = 0.1;
			const newZoom = Math.max(
				minZoom,
				Math.min(maxZoom, zoom - event.deltaY * zoomSpeed),
			);
			setZoom(newZoom);
		},
		[zoom, minZoom, maxZoom],
	);

	return {
		zoom,
		handleZoom,
	};
};

export default useCanvasZoom;
