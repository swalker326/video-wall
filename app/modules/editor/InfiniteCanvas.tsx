"use client";
import { RECT_H, RECT_W } from "@/app/constants";
import { CanvasPosition, Position } from "../../modules/core/foundation";
import CanvasStore from "../../modules/state/CanvasStore";
import { memo } from "react";
import { gatherCoordinates } from "./coordinateUtils";
import { Coordinate } from "./CanvasRoot";

interface VideoBlockProps extends CanvasPosition {
	text: string;
	width: number;
	height: number;
}

const VideoBlock = ({ text, left, top, width, height }: VideoBlockProps) => {
	return (
		<Position left={left} top={top} width={width} height={height}>
			<div
				className="flex items-center justify-center object-cover"
				style={{
					width: `${width}px`,
					height: `${height}px`,
					// background: color,
				}}
			>
				<video
					className="w-full h-full object-cover"
					muted
					loop
					autoPlay
					src={text}
				/>
			</div>
		</Position>
	);
};

const InfiniteCanvas = ({
	frame,
	startingCoordinate,
}: { frame: string; startingCoordinate: Coordinate }) => {
	const rectW = RECT_W;
	const rectH = RECT_H;
	const scale = CanvasStore.scale;

	return (
		<div
			className="w-full h-full"
			style={{
				transform: `scale(${
					// biome-ignore lint/style/noCommaOperator: <explanation>
					(scale.x, scale.y)
				})`,
				transformOrigin: "top left",
			}}
		>
			{/* {videos.map(({ src, id }, index) => {
				return (
					<VideoBlock
						key={id}
						text={src}
						left={(index % 3) * rectW}
						top={Math.floor(index / 3) * rectH}
						width={rectW}
						height={rectH}
					/>
				);
			})} */}
		</div>
	);
};

export default memo(InfiniteCanvas);
