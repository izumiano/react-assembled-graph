import { BarChartNode, GraphContext } from "../src/index";
import "./App.css";
import { useState } from "react";

function App() {
	const [bars, setBars] = useState<{ index: number; values: number[] }[]>([]);
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
							setBars((prev) => [
								{
									index: prev.length,
									values: [
										Math.random() * 100,
										Math.random() * 100,
										Math.random() * 100,
										Math.random() * 100,
										Math.random() * 100,
									],
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
							const newBars = [...bars];
							newBars.forEach((bar) => {
								bar.values = [
									Math.random() * 100,
									Math.random() * 100,
									Math.random() * 100,
									Math.random() * 100,
									Math.random() * 100,
								];
							});
							setBars(newBars);
						}}
					>
						Randomize
					</button>
					<GraphContext>
						{bars.map((bar) => (
							<BarChartNode
								key={bar.index}
								width="calc(100vw - 64px)"
								height="calc(50vh - 64px)"
								data={[
									{ title: "⭐", value: bar.values[0] },
									{ title: "⭐⭐", value: bar.values[1] },
									{ title: "⭐⭐⭐", value: bar.values[2] },
									{ title: "⭐⭐⭐⭐", value: bar.values[3] },
									{ title: "⭐⭐⭐⭐⭐", value: bar.values[4] },
								]}
								options={{
									backgroundColor: { r: 170, g: 100, b: 120, a: 255 },
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
