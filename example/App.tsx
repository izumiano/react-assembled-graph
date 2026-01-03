import { BarChartNode, GraphContext } from "../src/index";
import "./App.css";
import { useState } from "react";

function App() {
	const [bars, setBars] = useState<number[]>([]);
	const [contextActive, setContextActive] = useState(true);

	return (
		<>
			<button
				type="button"
				onClick={() => {
					setContextActive((prev) => !prev);
				}}
			>
				{contextActive ? "Disable Context" : "Enable Context"}
			</button>
			{contextActive ? (
				<>
					<button
						type="button"
						onClick={() => {
							setBars((prev) => [prev.length, ...prev]);
						}}
					>
						Add graph
					</button>
					<GraphContext>
						{bars.map((bar) => (
							<BarChartNode
								key={bar}
								width="calc(100vw - 64px)"
								height="calc(50vh - 64px)"
								options={{
									backgroundColor: { r: 0, g: 50, b: 0, a: 255 },
									gap: 10,
									titleFontSize: 20,
									valueAxis: { width: 40 },
									positioning: 20,
									minWidth: 10,
								}}
							/>
						))}
					</GraphContext>
				</>
			) : null}
		</>
	);
}

export default App;
