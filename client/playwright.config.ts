import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./ui-tests",

  // ---------- Dev Server ----------

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",

    // Prevent zombie dev servers in CI
    reuseExistingServer: !process.env.CI,

    timeout: 120000,

    stdout: "pipe",
    stderr: "pipe",
  },

  // ---------- Global Test Settings ----------

  use: {
    baseURL: "http://localhost:5173",

    // Debugging tools
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",

    headless: true,

    // Stable viewport for modals + responsive layouts
    viewport: { width: 1280, height: 800 },

    // Prevent hanging steps
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  // ---------- Execution Strategy ----------

  fullyParallel: false,

  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
      },
    },
  ],

  // ---------- Assertion Timing ----------

  expect: {
    timeout: 8000,
  },

  // ---------- CI Resource Protection ----------

  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 1 : 0,

  // ---------- TypeScript ----------

  tsconfig: "./tsconfig.playwright.json",
});
