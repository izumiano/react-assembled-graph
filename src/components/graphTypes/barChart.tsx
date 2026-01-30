import {
	type CSSProperties,
	type ReactNode,
	type RefObject,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	BarChart,
	type OnValueAxisLayoutParams,
	type BarChartCallbacks as InternalBarChartCallbacks,
	type BarChartData,
	type BarChartOptions as InternalBarChartOptions,
	type GraphManager,
	type OnLabelsLayoutParams,
	type BarChart_OnSelectionChangeArgs as InternalBarChart_OnSelectionChangeArgs,
} from "../../assembledGraphImport";
import { useGraphContext } from "../graphContext";
import ValueAxis from "../valueAxis";
import TitlesOverlay from "../titlesOverlay";

type ReactBarChartOptions = { touchPreventScroll?: boolean };

export type BarChartCallbacks = Omit<
	InternalBarChartCallbacks<ReactNode>,
	"onTitleLayout" | "onValueAxisLayout"
>;

export type BarChart_OnSelectionChangeArgs =
	InternalBarChart_OnSelectionChangeArgs<ReactNode>;

export type BarChartOptions = InternalBarChartOptions & ReactBarChartOptions;

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
	data: { label: ReactNode; displayLabel?: ReactNode; value: number }[];
	options?: BarChartOptions;
} & BarChartCallbacks) {
	const touchAction = options?.touchPreventScroll ? "none" : "unset";

	const [valueAxisLayout, setValueAxisLayout] =
		useState<OnValueAxisLayoutParams>([]);

	const [labelsLayout, setLabelsLayout] = useState<
		OnLabelsLayoutParams<ReactNode>
	>([]);

	const internalData = data.map((data) => {
		return {
			label: data.displayLabel === undefined ? data.label : data.displayLabel,
			value: data.value,
		};
	});

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
				position: "relative",
			}}
		>
			<canvas
				ref={useGraph({
					data: internalData,
					options,
					onSelectionChange,
					onHover,
					onValueAxisLayout: setValueAxisLayout,
					onLabelsLayout: setLabelsLayout,
				})}
			/>
			<ValueAxis layout={valueAxisLayout} />
			<TitlesOverlay layout={labelsLayout} />
		</div>
	);
}

function useGraph<T extends HTMLCanvasElement>({
	data,
	options,
	onSelectionChange,
	onHover,
	onLabelsLayout,
	onValueAxisLayout,
}: {
	data: BarChartData<ReactNode>;
	options?: InternalBarChartOptions;
} & InternalBarChartCallbacks<ReactNode>) {
	const canvas = useRef<T>(null);
	const resizeObserverRef = useRef<ResizeObserver>(null);

	const graphRenderer = useRef<BarChart<ReactNode>>(null);

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
				{ onSelectionChange, onHover, onLabelsLayout, onValueAxisLayout },
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
		onLabelsLayout,
		onValueAxisLayout,
	]);

	return canvas;
}

function initGraph(
	canvas: HTMLCanvasElement,
	parentElem: HTMLElement,
	graphManager: GraphManager,
	graphRendererRef: RefObject<BarChart<ReactNode> | null>,
	resizeObserverRef: RefObject<ResizeObserver | null>,
	data: BarChartData<ReactNode>,
	options: InternalBarChartOptions | undefined,
	{
		onSelectionChange,
		onHover,
		onLabelsLayout,
		onValueAxisLayout,
	}: InternalBarChartCallbacks<ReactNode>,
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
			onLabelsLayout,
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
