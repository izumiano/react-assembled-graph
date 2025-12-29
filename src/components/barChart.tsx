import {
	BarChart,
	type BarChartOptions,
	GraphManager,
} from "@izumiano/assembled-graph";

import { type RefObject, useEffect, useRef } from "react";

export function BarChartNode({
	width,
	height,
	options,
}: {
	width: string;
	height: string;
	options?: BarChartOptions;
}) {
	return (
		<div
			className="assembled-graph-canvas-container"
			style={{ width, height, overflow: "hidden" }}
		>
			<canvas ref={useGraph(options)} />
		</div>
	);
}

function useGraph<T extends HTMLCanvasElement>(options?: BarChartOptions) {
	const canvas = useRef<T>(null);
	const graphManagerRef = useRef<GraphManager>(null);
	const resizeObserverRef = useRef<ResizeObserver>(null);

	useEffect(() => {
		const currCanvas = canvas.current;
		const parentElem = currCanvas?.parentElement;

		if (currCanvas && parentElem) {
			initGraph(
				currCanvas,
				parentElem,
				graphManagerRef,
				resizeObserverRef,
				options,
			);
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
	options?: BarChartOptions,
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
			options ?? {},
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
