import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
    reporters: ["default", "verbose"],
    outputFile: {
      junit: "./test-results.xml",
    },
    clearMocks: true,
    restoreMocks: true,
    testTimeout: 15000,

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules/",
        "tests/",
        "dist/",
      ],
    },
  },
});

