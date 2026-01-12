import { type RefObject, useEffect, useRef } from "react";
import {
	BarChart,
	type BarChartData,
	type BarChartOptions,
	type GraphManager,
} from "#assembledGraph";
import { useGraphContext } from "./graphContext";

export function BarChartNode({
	width,
	height,
	data,
	options,
}: {
	width: string;
	height: string;
	data: BarChartData;
	options?: BarChartOptions;
}) {
	return (
		<div
			className="assembled-graph-canvas-container"
			style={{ width, height, overflow: "hidden" }}
		>
			<canvas ref={useGraph(data, options)} />
		</div>
	);
}

function useGraph<T extends HTMLCanvasElement>(
	data: BarChartData,
	options?: BarChartOptions,
) {
	const canvas = useRef<T>(null);
	const resizeObserverRef = useRef<ResizeObserver>(null);

	const graphRenderer = useRef<BarChart>(null);

	const graphManager = useGraphContext();

	const dataRef = useRef(data);
	const optionsRef = useRef(options);

	useEffect(() => {
		graphRenderer.current?.updateData(data, graphManager.getTimestamp());
	}, [data, graphManager]);

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
				dataRef.current,
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
	data: BarChartData,
	options?: BarChartOptions,
) {
	canvas.width = parentElem.clientWidth;
	canvas.height = parentElem.clientHeight;

	const graph = new BarChart(
		canvas,
		data,
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
