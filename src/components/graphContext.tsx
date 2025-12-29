import { GraphManager } from "@izumiano/assembled-graph";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

export const GraphContextProvider = createContext<GraphManager | null>(null);

export function useGraphContext() {
	const graphManager = useContext(GraphContextProvider);

	if (!graphManager) {
		throw new Error(
			"All components that use the graph context must be placed within a GraphContext element.",
		);
	}

	return graphManager;
}

export default function GraphContext({ children }: { children: ReactNode }) {
	const [graphManager, setGraphManager] = useState<GraphManager | null>(null);

	useEffect(() => {
		(async () => {
			setGraphManager(await GraphManager.create());
		})();

		// TODO: clean up graph manager
	}, []);

	return (
		<GraphContextProvider.Provider value={graphManager}>
			{graphManager ? children : null}
		</GraphContextProvider.Provider>
	);
}
