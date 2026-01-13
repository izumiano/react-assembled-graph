import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { GraphManager } from "../assembledGraphImport";

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
	const createManagerAbortController = useRef(new AbortController());

	useEffect(() => {
		(async () => {
			setGraphManager(
				await GraphManager.create(createManagerAbortController.current.signal),
			);
		})();

		return () => {
			createManagerAbortController.current.abort();
			createManagerAbortController.current = new AbortController();
		};
	}, []);

	return (
		<GraphContextProvider.Provider value={graphManager}>
			{graphManager ? children : null}
		</GraphContextProvider.Provider>
	);
}
