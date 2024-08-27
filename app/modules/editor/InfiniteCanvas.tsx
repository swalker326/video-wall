import { RECT_H, RECT_W, VIDEO_URLS } from "@/app/constants";
import { CanvasPosition, Position } from "../../modules/core/foundation";
import CanvasStore from "../../modules/state/CanvasStore";
import { memo } from "react";
import { cn } from "@/lib/utils";

interface TextBlockProps extends CanvasPosition {
	text: string;
	color: string;
	width: number;
	height: number;
}

const TextBlock = ({
	text,
	color,
	left,
	top,
	width,
	height,
}: TextBlockProps) => {
	return (
		<Position left={left} top={top} width={width} height={height}>
			<div
				className="flex items-center justify-center"
				style={{
					width: `${width}px`,
					height: `${height}px`,
					background: color,
				}}
			>
				{text}
			</div>
		</Position>
	);
};

const InfiniteCanvas = ({ frame }: { frame: string }) => {
	const rectW = RECT_W;
	const rectH = RECT_H;
	const scale = CanvasStore.scale;

	return (
		<div
			className="w-full h-full relative"
			style={{
				transform: `scale(${
					// biome-ignore lint/style/noCommaOperator: <explanation>
					(scale.x, scale.y)
				})`,
				transformOrigin: "top left",
			}}
		>
			{VIDEO_URLS.map((text, index) => {
				console.log("LEFT", (index % 3) * rectW);
				return (
					<video
						// className={cn(
						// 	`left-[${(index % 3) * rectW}px] top-[${
						// 		Math.floor(index / 3) * rectH
						// 	}px] w-[${rectW}px] h-[${rectH}px] absolute`,
						// )}
						style={{
							left: `${(index % 3) * rectW}px`,
							top: `${Math.floor(index / 3) * rectH}px`,
							width: `${rectW}px`,
							height: `${rectH}px`,
						}}
						muted
						loop
						autoPlay
						key={`${text}-${index}`}
						src={text}
					/>
				);
			})}
		</div>
	);
};

export default memo(InfiniteCanvas);
