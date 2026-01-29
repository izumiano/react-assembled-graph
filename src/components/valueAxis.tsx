import type { OnValueAxisLayoutParams } from "../assembledGraphImport";
import OverlayContainer from "./overlayContainer";

export default function ValueAxis({
	layout,
}: {
	layout: OnValueAxisLayoutParams;
}) {
	return (
		<OverlayContainer
			layout={layout.map((item) => {
				return { ...item, node: item.value };
			})}
			className="assembled-graph__value-axis-container"
			layoutFunc={layoutFunc}
			itemStyle={{ textAlign: "right" }}
		/>
	);
}

function layoutFunc(
	elem: HTMLElement,
	_index: number,
	x: number,
	y: number,
	width: number,
) {
	const boundingRect = elem.getBoundingClientRect();

	elem.style.left = `calc(${x}px - 0.5%)`;
	elem.style.top = `${y - boundingRect.height / 2}px`;
	elem.style.width = `${width}px`;
}
