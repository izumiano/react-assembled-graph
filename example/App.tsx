import {
	__assembledGraphLogger__,
	type OnSelectionChangeArgs,
} from "../src/assembledGraphImport";
import { BarChartNode, GraphContext } from "../src/index";
import "./App.css";
import { useCallback, useState } from "react";

function App() {
	const [bars, setBars] = useState<{ index: number; values: number[] }[]>([]);
	const [contextActive, setContextActive] = useState(true);

	const onSelectionChange = useCallback((info: OnSelectionChangeArgs) => {
		console.debug(info?.data);
	}, []);

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
								height="20rem"
								style={{ margin: "2rem" }}
								data={[
									{ title: "⭐", value: bar.values[0] },
									{ title: "⭐⭐", displayTitle: "", value: bar.values[1] },
									{ title: "⭐⭐⭐", displayTitle: "", value: bar.values[2] },
									{
										title: "⭐⭐⭐⭐",
										displayTitle: "",
										value: bar.values[3],
									},
									{ title: "⭐⭐⭐⭐⭐", value: bar.values[4] },
								]}
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
								onSelectionChange={onSelectionChange}
							/>
						))}
					</GraphContext>
				</>
			) : null}
		</>
	);
}

export default App;
