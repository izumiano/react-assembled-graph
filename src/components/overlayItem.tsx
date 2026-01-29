import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import type { LayoutFunc } from "./overlayContainer";

export default function OverlayItem({
	index,
	x,
	y,
	width,
	layoutFunc,
	style,
	children,
}: {
	index: number;
	x: number;
	y: number;
	width: number;
	layoutFunc: LayoutFunc;
	style: CSSProperties;
	children: ReactNode;
}) {
	const itemRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const elem = itemRef.current;

		if (!elem) {
			return;
		}

		// HACK: calling layoutFunc twice makes sure we use updated width for position calculation
		layoutFunc(elem, index, x, y, width);
		layoutFunc(elem, index, x, y, width);
		elem.style.visibility = "visible";
	}, [width, x, y, layoutFunc, index]);

	return (
		<span
			ref={itemRef}
			style={{
				...style,
				position: "absolute",
				visibility: "hidden",
			}}
			className="assembled-graph__overlay-item"
		>
			{children}
		</span>
	);
}
