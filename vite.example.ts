import { biomePlugin } from "@pbr1111/vite-plugin-biome";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
		plugins: [react(), biomePlugin()],
		base: "/react-assembled-graph/",
		resolve: {
			alias: {"#assembledGraph": "@izumiano/assembled-graph"}
		},
		build:{
			rollupOptions:{
				output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name]-[hash].js`,
        assetFileNames: `[name]-[hash].[extname]`,
      },
			}
		}
	}
);
