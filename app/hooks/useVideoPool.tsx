import React, { useRef, useCallback } from "react";

const MAX_VIDEO_PLAYERS = 50; // Limit the number of video players
const VIDEO_URL =
	"https://pub-7f62fc5682c046d88ab08dadf16e1018.r2.dev/test.mp4";

export const useVideoPool = () => {
	const videoPool = useRef<Map<string, HTMLVideoElement>>(new Map());

	const getVideoElement = useCallback((key: string) => {
		let videoElement = videoPool.current.get(key);

		if (!videoElement && videoPool.current.size < MAX_VIDEO_PLAYERS) {
			videoElement = document.createElement("video");
			videoElement.src = VIDEO_URL;
			videoElement.loop = true;
			videoElement.muted = true;
			videoElement.style.border = "2px solid red";

			document.body.appendChild(videoElement);

			// Add a border to the video for debugging
			videoElement.style.border = "2px solid red";
			videoElement.style.position = "absolute";
			videoElement.style.top = "-1000px"; // Hide the video offscreen

			videoPool.current.set(key, videoElement);
			console.log(`Created and added new video element for key: ${key}`);
		}

		return videoElement || null;
	}, []);

	const cleanupExcessVideos = useCallback(() => {
		if (videoPool.current.size > MAX_VIDEO_PLAYERS) {
			const keys = Array.from(videoPool.current.keys());
			while (videoPool.current.size > MAX_VIDEO_PLAYERS) {
				const key = keys.shift();
				if (key) {
					const videoElement = videoPool.current.get(key);
					if (videoElement) {
						videoElement.pause();
						videoElement.remove();
						videoPool.current.delete(key);
					}
				}
			}
		}
	}, []);

	return {
		getVideoElement,
		cleanupExcessVideos,
	};
};
