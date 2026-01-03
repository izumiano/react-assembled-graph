import {
	BarChart,
	type BarChartOptions,
	type GraphManager,
} from "@izumiano/assembled-graph";

import { type RefObject, useEffect, useRef } from "react";
import { useGraphContext } from "./graphContext";

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
	const resizeObserverRef = useRef<ResizeObserver>(null);

	const graphRenderer = useRef<BarChart>(null);

	const graphManager = useGraphContext();

	const optionsRef = useRef(options);

	useEffect(() => {
		const currCanvas = canvas.current;
		const parentElem = currCanvas?.parentElement;

		if (currCanvas && parentElem) {
			initGraph(
				currCanvas,
				parentElem,
				graphManager,
				graphRenderer,
				resizeObserverRef,
				optionsRef.current,
			);
		}

		return () => {
			if (graphRenderer.current) {
				graphManager.removeGraph(graphRenderer.current);
			}
			graphRenderer.current = null;
			resizeObserverRef.current?.disconnect();
			resizeObserverRef.current = null;
		};
	}, [graphManager]);

	return canvas;
}

function initGraph(
	canvas: HTMLCanvasElement,
	parentElem: HTMLElement,
	graphManager: GraphManager,
	graphRendererRef: RefObject<BarChart | null>,
	resizeObserverRef: RefObject<ResizeObserver | null>,
	options?: BarChartOptions,
) {
	canvas.width = parentElem.clientWidth;
	canvas.height = parentElem.clientHeight;

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
	graphRendererRef.current = graph;
	graphManager.addGraph(graph);

	resizeObserverRef.current = new ResizeObserver((entries) => {
		for (const entry of entries) {
			const { width, height } = entry.contentRect;
			if (canvas.width === width && canvas.height === height) {
				return;
			}

			graph.resize(width, height);
			graph.update(graphManager.getTimestamp() ?? 0);
			graph.render();
		}
	});
	resizeObserverRef.current.observe(parentElem);
}
