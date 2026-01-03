import "./App.css";
import { BarChartNode, GraphContext } from "../src/index";

function App() {
	return (
		<GraphContext>
			<BarChartNode
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
			<BarChartNode
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
		</GraphContext>
	);
}

export default App;
