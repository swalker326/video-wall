import CanvasStore from "../../modules/state/CanvasStore";
import { useEffect, useRef, useState } from "react";

class RenderLoop {
	private lastFrameTime = 0;
	private lastRequestId: number | null = null;
	constructor(
		private draw: () => void,
		private fps = 0,
	) {}

	initialize(fps: number) {
		this.fps = fps;
	}

	start() {
		this.lastFrameTime = performance.now();
		this.loop();
	}

	stop() {
		if (this.lastRequestId) cancelAnimationFrame(this.lastRequestId);
		this.lastRequestId = null;
	}

	private get fpsInterval() {
		return 1000 / this.fps;
	}

	private loop() {
		this.lastRequestId = requestAnimationFrame(() => this.loop());
		const now = performance.now();
		const elapsed = now - this.lastFrameTime;
		if (elapsed > this.fpsInterval) {
			this.lastFrameTime = now - (elapsed % this.fpsInterval);
			this.draw();
		}
	}
}

let renderLoop: RenderLoop;
export function getRenderLoop(draw: () => void, fps = 15) {
	if (!renderLoop) return new RenderLoop(draw, fps);
	return renderLoop;
}

export const useRenderLoop = (fps = 15) => {
	const [frame, setFrame] = useState("0");
	const loop = useRef<RenderLoop>(
		getRenderLoop(() => {
			if (CanvasStore.shouldRender) {
				setFrame(`${performance.now()}`);
				CanvasStore.shouldRender = false;
			}
		}, fps),
	);

	useEffect(() => {
		CanvasStore.shouldRender = true;
		loop.current.start();

		return () => loop.current.stop();
	}, []);
	return frame;
};

export default useRenderLoop;
