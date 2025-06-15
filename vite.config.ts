import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	root: "demo", // Set demo as the root for Vite dev server
	plugins: [
		dts({
			entryRoot: "dist",
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "joy-con-webhid",
			fileName: (format) => `joy-con-webhid.${format}.js`,
			formats: ["es"],
		},
		rollupOptions: {
			output: {
				dir: "dist",
				format: "es",
			},
		},
		emptyOutDir: true,
		outDir: "dist",
	},
});
