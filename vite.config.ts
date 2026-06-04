import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  return {
    appType: "custom",
    build: {
      ssr: true,
      target: "esnext",
      watch: mode === "development" ? {} : null,
      minify: mode === "development" ? false : true,
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        fileName: "index",
        formats: ["es"]
      },
      rollupOptions: {
        external: [
          "vite"
        ],
        output: {
          
        }
      }
    }
  };
});