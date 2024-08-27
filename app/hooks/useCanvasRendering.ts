import { VIDEO_SIZE } from "@/components/InfiniteCanvas";
import React, { useEffect, useRef } from "react";

export const useCanvasRendering = (
	canvasRef: React.RefObject<HTMLCanvasElement>,
	positions: { x: number; y: number }[],
	getVideoElement: (key: string) => HTMLVideoElement | null,
	cleanupExcessVideos: () => void,
) => {
	const previousKeys = useRef<Set<string>>(new Set());
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const context = canvas.getContext("2d");
		if (!context) return;

		const render = () => {
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.strokeStyle = "lightgray";
			context.lineWidth = 1;

			const currentKeys = new Set<string>();

			// biome-ignore lint/complexity/noForEach: <explanation>
			positions.forEach(({ x, y }) => {
				context.strokeRect(x, y, VIDEO_SIZE, VIDEO_SIZE);
				const key = `${x}-${y}`;
				currentKeys.add(key);
				const videoElement = getVideoElement(key);

				if (videoElement) {
					// console.log("Video Element Found: ", videoElement);
					// console.log(x, y, canvas.width, canvas.height);
					if (isInView(x, y, VIDEO_SIZE, VIDEO_SIZE, canvas)) {
						if (videoElement.readyState >= 2) {
							// Check if the video has loaded enough data
							if (videoElement.paused && !videoElement.ended) {
								videoElement
									.play()
									.then(() => {
										if (!previousKeys.current.has(key)) {
											console.log(`Playing video for key: ${key}`);
										}
									})
									.catch((error) => {
										console.log("Video play was interrupted:", error);
									});
							}
							context.drawImage(videoElement, x, y, VIDEO_SIZE, VIDEO_SIZE);
						} else {
							console.log("Video is not ready to play yet.");
						}
					} else {
						if (!videoElement.paused) {
							videoElement.pause();
							console.log(`Paused video for key: ${key}`);
						}
					}
				}
			});

			// Update the previous keys for the next render cycle
			previousKeys.current = currentKeys;

			cleanupExcessVideos();
			requestAnimationFrame(render);
		};

		render();
	}, [canvasRef, positions, getVideoElement, cleanupExcessVideos]);
};

const isInView = (
	x: number,
	y: number,
	width: number,
	height: number,
	canvas: HTMLCanvasElement,
) => {
	return (
		x + width > 0 && x < canvas.width && y + height > 0 && y < canvas.height
	);
};
