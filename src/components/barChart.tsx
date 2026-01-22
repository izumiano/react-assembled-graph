import { type CSSProperties, type RefObject, useEffect, useRef } from "react";
import {
	BarChart,
	type BarChartCallbacks,
	type BarChartData,
	type BarChartOptions,
	type GraphManager,
} from "../assembledGraphImport";
import { useGraphContext } from "./graphContext";

type ReactBarChartOptions = { touchPreventScroll?: boolean };

export function BarChartNode({
	width,
	height,
	style,
	data,
	options,
	callbacks,
}: {
	width?: string;
	height?: string;
	style?: CSSProperties;
	data: BarChartData;
	options?: BarChartOptions & ReactBarChartOptions;
	callbacks?: BarChartCallbacks;
}) {
	const touchAction = options?.touchPreventScroll ? "none" : "unset";

	return (
		<div
			className="assembled-graph-canvas-container"
			style={{
				...style,
				width,
				height,
				overflow: "hidden",
				userSelect: "none",
				WebkitUserSelect: "none",
				touchAction,
				msTouchAction: touchAction,
			}}
		>
			<canvas ref={useGraph(data, options, callbacks)} />
		</div>
	);
}

function useGraph<T extends HTMLCanvasElement>(
	data: BarChartData,
	options?: BarChartOptions,
	callbacks?: BarChartCallbacks,
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
				callbacks,
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
	}, [graphManager, callbacks]);

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
	callbacks?: BarChartCallbacks,
) {
	const graph = new BarChart(
		canvas,
		parentElem.clientWidth,
		parentElem.clientHeight,
		data,
		options ?? {},
		callbacks,
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
			graph.render(graphManager.getTimestamp() ?? 0);
		}
	});
	resizeObserverRef.current.observe(parentElem);
}
