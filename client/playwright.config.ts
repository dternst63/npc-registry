import { defineConfig } from "@playwright/test";

export default defineConfig({

  testDir: "./ui-tests",

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",

    // IMPORTANT for CI stability
    reuseExistingServer: false,

    timeout: 120000,

    // Helpful for CI debugging
    stdout: "pipe",
    stderr: "pipe",
  },

  use: {
    baseURL: "http://localhost:5173",

    trace: "on-first-retry",

    headless: true,

    // CI speed + reliability
    viewport: { width: 1280, height: 800 },
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  fullyParallel: false,

  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],

  expect: {
    timeout: 5000,
  },

  // Prevent resource exhaustion on GitHub runners
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 2 : 0,


  tsconfig: "./tsconfig.playwright.json",

});
