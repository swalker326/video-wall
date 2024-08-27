import { useState, useCallback } from "react";

export const useCanvasDrag = (initialOffset: { x: number; y: number }) => {
	const [offset, setOffset] = useState<{ x: number; y: number }>(initialOffset);
	const [isDragging, setIsDragging] = useState(false);
	const [lastMousePosition, setLastMousePosition] = useState<{
		x: number;
		y: number;
	} | null>(null);

	const handleMouseDown = useCallback(
		(event: React.MouseEvent<HTMLCanvasElement>) => {
			setIsDragging(true);
			setLastMousePosition({ x: event.clientX, y: event.clientY });
		},
		[],
	);

	const handleMouseMove = useCallback(
		(event: React.MouseEvent<HTMLCanvasElement>) => {
			if (isDragging && lastMousePosition) {
				const deltaX = event.clientX - lastMousePosition.x;
				const deltaY = event.clientY - lastMousePosition.y;

				setOffset((prev) => ({
					x: prev.x - deltaX,
					y: prev.y - deltaY,
				}));

				setLastMousePosition({ x: event.clientX, y: event.clientY });
			}
		},
		[isDragging, lastMousePosition],
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
		setLastMousePosition(null);
	}, []);

	return {
		offset,
		setOffset,
		isDragging,
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
	};
};

export default useCanvasDrag;
