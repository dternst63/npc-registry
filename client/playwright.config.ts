import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./ui-tests",

  // ---------- Dev Server ----------

  webServer: {
    command: "npm run preview -- --host --strictPort",
    port: 4173,

    reuseExistingServer: !process.env.CI,
    timeout: 120000,

    // 🔥 FIX: Inject frontend env vars for CI
    env: {
      VITE_API_BASE_URL: "http://localhost:3001",
    },

    stdout: "pipe",
    stderr: "pipe",
  },

  // ---------- Reporting ----------

  reporter: [
    ["list"],
    ["html", { open: "never" }],
  ],

  // ---------- Browser Settings ----------

  use: {
    baseURL: "http://localhost:4173",

    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",

    headless: true,

    viewport: { width: 1280, height: 800 },

    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  // ---------- Execution Strategy ----------

  fullyParallel: false,

  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],

  // ---------- Assertion Timing ----------

  expect: {
    timeout: 8000,
  },

  // ---------- CI Protection ----------

  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 1 : 0,

  // ---------- TypeScript ----------

  tsconfig: "./tsconfig.playwright.json",
});
