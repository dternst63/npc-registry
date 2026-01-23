import { defineConfig } from "@playwright/test";

export default defineConfig({

  testDir: "./ui-tests",

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 120000,
  },

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    headless: true,
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

  tsconfig: "./tsconfig.playwright.json",

});
