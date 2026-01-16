import {
	__assembledGraphLogger__,
	type OnHoverArgs,
} from "../src/assembledGraphImport";
import { BarChartNode, GraphContext } from "../src/index";
import "./App.css";
import { useRef, useState } from "react";

function generateBars(randomizeCount: boolean) {
	const count = randomizeCount ? Math.floor(Math.random() * 15 + 1.5) : 5;

	const bars = [];
	for (let i = 0; i < count; i++) {
		bars.push(Math.floor(Math.random() * 100 + 0.5));
	}
	return bars;
}

function App() {
	const [barCharts, setBars] = useState<{ index: number; values: number[] }[]>(
		[],
	);
	const [contextActive, setContextActive] = useState(true);
	const [randomizeBarCount, setRandomizeBarCount] = useState(true);

	const callbacks = useRef({
		onHover: {
			func: (info: OnHoverArgs) => {
				console.debug(info?.data.title);
			},
		},
	});

	return (
		<>
			{import.meta.env.DEV && (
				<button type="button" onClick={__assembledGraphLogger__.sendLogs}>
					Send Logs
				</button>
			)}
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
							setBars((prev) => [
								{
									index: prev.length,
									values: generateBars(randomizeBarCount),
								},
								...prev,
							]);
						}}
					>
						Add graph
					</button>
					<button
						type="button"
						onClick={() => {
							const newBars = [...barCharts];
							newBars.forEach((bar) => {
								bar.values = generateBars(randomizeBarCount);
							});
							setBars(newBars);
						}}
					>
						Randomize
					</button>
					<label>
						<input
							type="checkbox"
							checked={randomizeBarCount}
							onChange={(e) => {
								setRandomizeBarCount(e.target.checked);
							}}
						></input>
						Randomize Count
					</label>
					<GraphContext>
						{barCharts.map((bars) => (
							<BarChartNode
								key={bars.index}
								height="20rem"
								style={{ margin: "2rem" }}
								data={bars.values.map((bar, index) => {
									let title = "";
									if (index === 0) {
										title = "⭐";
									} else if (index === bars.values.length - 1) {
										title = "⭐⭐⭐⭐⭐";
									}
									return { title, value: bar };
								})}
								options={{
									backgroundColor: { r: 80, g: 80, b: 175, a: 255 },
									barOptions: {
										gap: 25,
										minWidth: 10,
										minHeight: 5,
										hoverColor: { r: 255, g: 100, b: 100, a: 80 },
										selectedColor: { r: 150, g: 255, b: 150 },
									},
									titleFontSize: 20,
									valueAxis: { width: 40 },
									positioning: 20,
									touchPreventScroll: false,
								}}
								callbacks={callbacks.current}
							/>
						))}
					</GraphContext>
				</>
			) : null}
		</>
	);
}

export default App;
