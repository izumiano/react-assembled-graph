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
	onSelectionChange,
	onHover,
}: {
	width?: string;
	height?: string;
	style?: CSSProperties;
	data: BarChartData;
	options?: BarChartOptions & ReactBarChartOptions;
} & Omit<BarChartCallbacks, "onTitleLayout" | "onValueAxisLayout">) {
	const touchAction = options?.touchPreventScroll ? "none" : "unset";

	return (
		<div
			className="assembled-graph__canvas-container"
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
			<canvas ref={useGraph({ data, options, onSelectionChange, onHover })} />
		</div>
	);
}

function useGraph<T extends HTMLCanvasElement>({
	data,
	options,
	onSelectionChange,
	onHover,
	onTitleLayout,
	onValueAxisLayout,
}: { data: BarChartData; options?: BarChartOptions } & BarChartCallbacks) {
	const canvas = useRef<T>(null);
	const resizeObserverRef = useRef<ResizeObserver>(null);

	const graphRenderer = useRef<BarChart>(null);

	const graphManager = useGraphContext();

	const dataRef = useRef(data);
	const optionsRef = useRef(options);

	// TODO: update options in assembledGraph when 'options' value changes

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
				{ onSelectionChange, onHover, onTitleLayout, onValueAxisLayout },
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
	}, [
		graphManager,
		onHover,
		onSelectionChange,
		onTitleLayout,
		onValueAxisLayout,
	]);

	return canvas;
}

function initGraph(
	canvas: HTMLCanvasElement,
	parentElem: HTMLElement,
	graphManager: GraphManager,
	graphRendererRef: RefObject<BarChart | null>,
	resizeObserverRef: RefObject<ResizeObserver | null>,
	data: BarChartData,
	options: BarChartOptions | undefined,
	{
		onSelectionChange,
		onHover,
		onTitleLayout,
		onValueAxisLayout,
	}: BarChartCallbacks,
) {
	const graph = new BarChart(
		canvas,
		parentElem.clientWidth,
		parentElem.clientHeight,
		data,
		{
			options: options ?? {},
			onSelectionChange,
			onHover,
			onTitleLayout,
			onValueAxisLayout,
		},
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
