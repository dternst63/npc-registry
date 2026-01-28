import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([

  // --------------------
  // Global ignores (never lint these)
  // --------------------
  globalIgnores([
    "dist",
    "coverage",
    "playwright-report",
    "test-results",
    "blob-report",
    "node_modules"
  ]),

  // --------------------
  // Node config files
  // --------------------
  {
    files: ["playwright.config.ts", "vite.config.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },

  // --------------------
  // Application source (STRICT)
  // --------------------
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: [
      "**/__tests__/**",
      "**/*.test.*",
      "**/*.spec.*"
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs.flat.recommended.rules,
      ...reactRefresh.configs.vite.rules,

      // Modern React JSX transform
      "no-undef": "off",

      // Use TS-aware unused vars
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
    },
  },

  // --------------------
  // Tests + Playwright (RELAXED)
  // --------------------
  {
    files: [
      "**/__tests__/**/*",
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "ui-tests/**/*"
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]
    },
  },

]);
