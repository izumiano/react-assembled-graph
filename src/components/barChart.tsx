import "./barChart.css";
import GraphManager from "@izumiano/assembled-graph";
import BarChart from "@izumiano/assembled-graph/graphTypes/barChart";

import { useEffect, useRef, type RefObject } from "react";

export default function BarChartNode() {
	return (
		<div className="canvasContainer">
			<canvas ref={useGraph()} />
		</div>
	);
}

function useGraph<T extends HTMLCanvasElement>() {
	const canvas = useRef<T>(null);
	const graphManagerRef = useRef<GraphManager>(null);
	const resizeObserverRef = useRef<ResizeObserver>(null);

	useEffect(() => {
		const currCanvas = canvas.current;
		const parentElem = currCanvas?.parentElement;

		if (currCanvas && parentElem) {
			initGraph(currCanvas, parentElem, graphManagerRef, resizeObserverRef);
		}

		return () => {
			// TODO: graphManagerRef.current?.dispose();
			graphManagerRef.current = null;

			resizeObserverRef.current?.disconnect();
			resizeObserverRef.current = null;
		};
	});

	return canvas;
}

function initGraph(
	canvas: HTMLCanvasElement,
	parentElem: HTMLElement,
	graphManagerRef: RefObject<GraphManager | null>,
	resizeObserverRef: RefObject<ResizeObserver | null>,
) {
	canvas.width = parentElem.clientWidth;
	canvas.height = parentElem.clientHeight;

	(async () => {
		const graphManager = await GraphManager.create();
		graphManagerRef.current = graphManager;
		const graph = new BarChart(
			canvas,
			[
				{ title: "⭐", value: 50 },
				{ title: "⭐⭐", value: 30 },
				{ title: "⭐⭐⭐", value: 3 },
				{ title: "⭐⭐⭐⭐", value: 0 },
				{ title: "⭐⭐⭐⭐⭐", value: 18 },
				{ title: "⭐", value: 80 },
				{ title: "⭐⭐", value: 0 },
				{ title: "⭐⭐⭐", value: 40 },
				{ title: "⭐⭐⭐⭐", value: 13 },
				{ title: "⭐⭐⭐⭐⭐", value: 18 },
			],
			{
				backgroundColor: { r: 10, g: 5, b: 40 },
				gap: 10,
				titleFontSize: 15,
				barCornerRadius: 20,
				valueAxis: { width: 40, minPixelDistance: 35 },
				positioning: { bottom: 30, top: 20, left: 10, right: 10 },
				minWidth: 5,
				minHeight: 7,
				hoverScale: 1.1,
			},
			// (info) => {
			// 	if (!info) {
			// 		graphInfoElem.classList.add("hidden");
			// 		return;
			// 	}
			// 	graphInfoElem.classList.remove("hidden");

			// 	const { data, positionInfo } = info;

			// 	graphInfoElem.innerText = data.title + data.value;

			// 	const rect = graphInfoElem.getBoundingClientRect();
			// 	let left = positionInfo.x - rect.width;
			// 	if (left < 0) {
			// 		left = positionInfo.x + positionInfo.width;
			// 	}
			// 	graphInfoElem.style.left = `${left}px`;
			// 	graphInfoElem.style.top = `${positionInfo.y}px`;
			// },
		);
		graphManager.addGraph(graph);

		resizeObserverRef.current = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect;

				graph.resize(width, height);
				graph.update(graphManager.getTimestamp());
				graph.render();
			}
		});

		resizeObserverRef.current.observe(parentElem);
	})();
}
