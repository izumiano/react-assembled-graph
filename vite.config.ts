import { biomePlugin } from "@pbr1111/vite-plugin-biome";
import dts from 'vite-plugin-dts';
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(() => {
	return {
		plugins: [
			react(), 
			biomePlugin(), 
			dts({insertTypesEntry: true, tsconfigPath: "./tsconfig.app.json", exclude: ["example", "src/assembledGraphImport.ts"]}),
		],
		base: "/",
		build: {
			lib: {
				entry: resolve(__dirname, "src/index.ts"),
				name: "react-assembledGraph",
				fileName: "index"
			},
			rollupOptions: {
				external: ["react", "react-dom", "@izumiano/assembled-graph"],
				output:{
					globals: {"react": "React", "react-dom": "ReactDOM", "@izumiano/assembled-graph": "react-assembledGraph"}
				}
			}
		},
	}
});
