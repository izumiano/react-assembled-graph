import { biomePlugin } from "@pbr1111/vite-plugin-biome";
import dts from 'vite-plugin-dts';
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({command}) => {
	const aliases = {"#assembledGraph": "@izumiano/assembled-graph"};

	if(command === "serve"){
		const env = loadEnv("development", process.cwd(), "VITE_");
		const assembledGraphPath = env.VITE_ASSEMBLED_GRAPH_PATH;
		if(assembledGraphPath){
			aliases["#assembledGraph"] = path.resolve(__dirname, assembledGraphPath);
		}
	}

	return {
		plugins: [react(), biomePlugin(), dts({insertTypesEntry: true, tsconfigPath: "./tsconfig.app.json"})],
		base: "/",
		resolve: {
			alias: aliases
		},
		build: {
			lib: {
				entry: resolve(__dirname, "src/index.ts"),
				name: "react-assembledGraph",
				fileName: "index"
			},
			rollupOptions: {
				external: ["react", "react-dom"],
				output:{
					globals: {"react": "React", "react-dom": "ReactDOM"}
				}
			}
		}
	}
});
