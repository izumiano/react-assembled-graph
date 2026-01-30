import {
	__assembledGraphLogger__,
	type BarChart_OnHoverArgs,
} from "../src/assembledGraphImport";
import { BarChartNode, GraphContext } from "../src/index";
import "./App.css";
import { useRef, useState, type ReactNode } from "react";
import { FilledStar } from "./filledStar";

function generateBars(randomizeCount: boolean) {
	const count = randomizeCount ? Math.floor(Math.random() * 15 + 1.5) : 5;

	const bars = [];
	for (let i = 0; i < count; i++) {
		bars.push(Math.floor(Math.random() * 100 + 0.5));
	}
	return bars;
}

function App() {
	const [barCharts, setBars] = useState<{ index: number; values: number[] }[]>([
		{ index: 0, values: [1, 4, 6, 7] },
	]);
	const [contextActive, setContextActive] = useState(true);
	const [randomizeBarCount, setRandomizeBarCount] = useState(true);

	const onHover = useRef({
		func: (info: BarChart_OnHoverArgs<ReactNode>) => {
			console.debug(info?.data.label);
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
									let label: ReactNode;
									if (index === 0) {
										label = <FilledStar />;
									} else if (index === bars.values.length - 1) {
										label = (
											<>
												<FilledStar />
												<FilledStar />
												<FilledStar />
												<FilledStar />
												<FilledStar />
											</>
										);
									}
									return { label, value: bar };
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
									valueAxis: { width: 40 },
									positioning: 25,
									touchPreventScroll: false,
								}}
								onHover={onHover.current}
							/>
						))}
					</GraphContext>
				</>
			) : null}
		</>
	);
}

export default App;
