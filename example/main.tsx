import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

if (
	import.meta.env.MODE === "development" &&
	/\?console/.test(window.location.href)
) {
	import("eruda").then((eruda) => eruda.default.init());
}

// biome-ignore lint/style/noNonNullAssertion: <root will always exist>
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
