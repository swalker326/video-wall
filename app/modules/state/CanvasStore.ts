import { RECT_W, RECT_H, CAMERA_ANGLE } from "@/app/constants";
import {
	cameraToScreenCoordinates,
	scaleWithAnchorPoint,
} from "../core/camera-utils";

export interface CanvasState {
	shouldRender: boolean;
	pixelRatio: number; // our resolution for dip calculations
	container: {
		//holds information related to our screen container
		width: number;
		height: number;
	};
	pointer: {
		x: number;
		y: number;
	};
	camera: {
		//holds camera state
		x: number;
		y: number;
		z: number;
	};
}
const getInitialCanvasState = (): CanvasState => {
	return {
		shouldRender: true,
		pixelRatio: globalThis?.window?.devicePixelRatio || 1,
		container: {
			width: 0,
			height: 0,
		},
		pointer: {
			x: 0,
			y: 0,
		},
		camera: {
			x: 0,
			y: 0,
			z: 0,
		},
	};
};

let canvasData = getInitialCanvasState();

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export default class CanvasStore {
	private static get data() {
		if (!canvasData)
			canvasData = {
				shouldRender: true,
				pixelRatio: globalThis?.window?.devicePixelRatio || 1,
				container: {
					width: 0,
					height: 0,
				},
				pointer: {
					x: 0,
					y: 0,
				},
				camera: {
					x: 0,
					y: 0,
					z: 0,
				},
			};
		return canvasData;
	}

	static initialize(width: number, height: number) {
		const containerWidth = width;
		const containerHeight = height;
		canvasData = getInitialCanvasState();
		canvasData.pixelRatio = globalThis?.window?.devicePixelRatio || 1;
		canvasData.container.width = containerWidth;
		canvasData.container.height = containerHeight;
		canvasData.camera.x = 1.5 * RECT_W;
		canvasData.camera.y = 1.5 * RECT_H;
		canvasData.camera.z = containerWidth / (2 * Math.tan(CAMERA_ANGLE));
	}
	public static get screen() {
		const { x, y, z } = CanvasStore.camera;
		const aspect = CanvasStore.aspect;
		const angle = CAMERA_ANGLE;
		return cameraToScreenCoordinates(x, y, z, angle, aspect);
	}
	public static get camera() {
		return CanvasStore.data.camera;
	}
	public static get scale() {
		const { width: w, height: h } = CanvasStore.screen;
		const { width: cw, height: ch } = CanvasStore.container;
		return { x: cw / w, y: ch / h };
	}
	public static get shouldRender() {
		return canvasData.shouldRender;
	}
	public static set shouldRender(value: boolean) {
		canvasData.shouldRender = value;
	}

	private static get container() {
		return canvasData.container;
	}

	private static get pointer() {
		return canvasData.pointer;
	}

	private static get aspect() {
		return canvasData.container.width / canvasData.container.height;
	}

	private static isCameraInBounds(
		cameraX: number,
		cameraY: number,
		cameraZ: number,
	) {
		return true;
		// const angle = radians(30);
		// const { x, y, width, height } = cameraToScreenCoordinates(
		//   cameraX,
		//   cameraY,
		//   cameraZ,
		//   angle,
		//   CanvasStore.aspect
		// );
		// const isXInBounds = x >= 0 && x <= CanvasStore.data.canvas.width;
		// const isYInBounds = y >= 0 && y <= CanvasStore.data.canvas.height;
		// return isXInBounds && isYInBounds;
	}

	public static moveCamera(mx: number, my: number) {
		const scrollFactor = 1.5;
		const deltaX = mx * scrollFactor;
		const deltaY = my * scrollFactor;
		const { x, y, z } = CanvasStore.camera;
		if (CanvasStore.isCameraInBounds(x + deltaX, y + deltaY, z)) {
			CanvasStore.data.camera.x += deltaX;
			CanvasStore.data.camera.y += deltaY;
			// move pointer by the same amount
			CanvasStore.shouldRender = true;
			CanvasStore.movePointer(deltaY, deltaY);
		}
	}

	public static zoomCamera(deltaX: number, deltaY: number) {
		// Normal zoom is quite slow, we want to scale the amount quite a bit
		const zoomScaleFactor = 10;
		const deltaAmount = zoomScaleFactor * Math.max(deltaY);
		const { x: oldX, y: oldY, z: oldZ } = CanvasStore.camera;
		const oldScale = { ...CanvasStore.scale };

		const { width: containerWidth, height: containerHeight } =
			CanvasStore.container;
		const { width, height } = cameraToScreenCoordinates(
			oldX,
			oldY,
			oldZ + deltaAmount,
			CAMERA_ANGLE,
			CanvasStore.aspect,
		);
		const newScaleX = containerWidth / width;
		const newScaleY = containerHeight / height;
		const { x: newX, y: newY } = scaleWithAnchorPoint(
			CanvasStore.pointer.x,
			CanvasStore.pointer.y,
			oldX,
			oldY,
			oldScale.x,
			oldScale.y,
			newScaleX,
			newScaleY,
		);
		const newZ = oldZ + deltaAmount;
		CanvasStore.shouldRender = true;
		if (CanvasStore.isCameraInBounds(oldX, oldY, newZ)) {
			CanvasStore.data.camera = {
				x: newX,
				y: newY,
				z: newZ,
			};
		}
	}

	// pointer position from top left of the screen
	public static movePointer(deltaX: number, deltaY: number) {
		const scale = CanvasStore.scale;
		const { x: left, y: top } = CanvasStore.screen;
		CanvasStore.data.pointer.x = left + deltaX / scale.x;
		CanvasStore.data.pointer.y = top + deltaY / scale.y;
	}
}
