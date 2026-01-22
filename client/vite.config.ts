import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",

    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json"],
      reportsDirectory: "./coverage",

      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },

      exclude: [
        "node_modules/",
        "src/test/",
        "src/__tests__/",
        "vite.config.ts",
      ],
    },
  },
});
