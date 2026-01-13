import { type CSSProperties, type RefObject, useEffect, useRef } from "react";
import {
	BarChart,
	type BarChartData,
	type BarChartOptions,
	type GraphManager,
	type OnSelectionChange,
} from "../assembledGraphImport";
import { useGraphContext } from "./graphContext";

type ReactBarChartOptions = { touchPreventScroll?: boolean };

export function BarChartNode({
	width,
	height,
	style,
	data,
	options,
	onSelectionChange,
}: {
	width?: string;
	height?: string;
	style: CSSProperties;
	data: BarChartData;
	options?: BarChartOptions & ReactBarChartOptions;
	onSelectionChange?: OnSelectionChange;
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
			<canvas ref={useGraph(data, options, onSelectionChange)} />
		</div>
	);
}

function useGraph<T extends HTMLCanvasElement>(
	data: BarChartData,
	options?: BarChartOptions,
	onSelectionChange?: OnSelectionChange,
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
				onSelectionChange,
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
	}, [graphManager, onSelectionChange]);

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
	onSelectionChange?: OnSelectionChange,
) {
	canvas.width = parentElem.clientWidth;
	canvas.height = parentElem.clientHeight;

	const graph = new BarChart(canvas, data, options ?? {}, onSelectionChange);
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
