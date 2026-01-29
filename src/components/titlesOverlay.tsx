import { useCallback, type ReactNode } from "react";
import OverlayContainer from "./overlayContainer";

export default function TitlesOverlay({
	layout,
}: {
	layout: {
		title: ReactNode;
		x: number;
		y: number;
		width: number;
		height: number;
		centerPoint: number;
	}[];
}) {
	const layoutFunc = useCallback(
		(elem: HTMLElement, index: number, x: number, y: number, width: number) => {
			const boundingRect = elem.getBoundingClientRect();

			const { centerPoint, height } = layout[index];

			const xOffset = centerPoint - boundingRect.width / 2;

			elem.style.left = `${x + xOffset}px`;
			elem.style.top = `${y}px`;
			elem.style.maxWidth = `${width - xOffset}px`;
			elem.style.maxHeight = `${height}px`;
		},
		[layout],
	);

	return (
		<OverlayContainer
			layout={layout.map((item) => {
				return {
					...item,
					node: item.title,
				};
			})}
			className="assembled-graph__titles-container"
			layoutFunc={layoutFunc}
			itemStyle={{
				display: "flex",
				whiteSpace: "nowrap",
			}}
		/>
	);
}

// function layoutFunc(elem: HTMLElement, x: number, y: number, width: number) {
// 	const boundingRect = elem.getBoundingClientRect();

// 	const xOffset = centerPoint - boundingRect.width / 2;

// 	return {
// 		x: `calc(${x}px - 0.5%)`,
// 		y: `${y - boundingRect.height / 2}px`,
// 		width: `${width}px`,
// 	};

// const boundingRect = measureElemNotInDocument(elem);
// const xOffset = centerPoint - boundingRect.width / 2;
// elem.style.left = `${x + xOffset}px`;
// elem.style.top = `${y}px`;

// elem.style.width = `${width - xOffset}px`;
// elem.style.height = `${height}px`;
// }
