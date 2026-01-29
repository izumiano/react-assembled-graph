import { useId, type CSSProperties, type ReactNode } from "react";
import OverlayItem from "./overlayItem";

export type LayoutFunc = (
	elem: HTMLElement,
	index: number,
	x: number,
	y: number,
	width: number,
) => void;

export default function OverlayContainer({
	layout,
	layoutFunc,
	itemStyle,
	className,
}: {
	layout: { node: ReactNode; x: number; y: number; width: number }[];
	layoutFunc: LayoutFunc;
	itemStyle?: CSSProperties;
	className?: string;
}) {
	const id = useId();

	itemStyle ??= {};

	return (
		<div
			className={`assembled-graph__overlay-container ${className}`}
			style={{
				position: "absolute",
				top: "0",
				width: "100%",
				height: "100%",
				pointerEvents: "none",
			}}
		>
			{layout.map((item, index) => {
				return (
					<OverlayItem
						key={`${id}_${index}`}
						index={index}
						x={item.x}
						y={item.y}
						width={item.width}
						layoutFunc={layoutFunc}
						style={itemStyle}
					>
						{item.node}
					</OverlayItem>
				);
			})}
		</div>
	);
}
