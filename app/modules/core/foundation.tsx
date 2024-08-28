import CanvasStore from "../../modules/state/CanvasStore";
import { PropsWithChildren } from "react";
import { inBounds } from "./math-utils";

export interface CanvasPosition {
	top: number;
	left: number;
	width: number;
	height: number;
}

export const Position = ({
	left,
	top,
	width,
	height,
	children,
}: PropsWithChildren<CanvasPosition>) => {
	const screen = CanvasStore.screen;
	
	if (
		inBounds(
			{ left, top, height, width },
			{
				left: screen.x,
				top: screen.y,
				width: screen.width,
				height: screen.height,
			},
		)
	) {
		return (
			<div
				className="absolute flex items-stretch"
				style={{
					left: `${left - screen.x}px`,
					top: `${top - screen.y}px`,
				}}
			>
				{children}
			</div>
		);
	}
	return null;
};
