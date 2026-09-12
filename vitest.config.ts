/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  test: {
    pool: "vmThreads",
    environment: "jsdom",
    globals: true,
    setupFiles: ["vitest.setup.ts"],
    include: ["src/**/*.{spec,test}.{ts,tsx}"],
    coverage: {
      reportsDirectory: "./coverage",
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/*.d.ts",
        "**/*.type.{ts,tsx}",
        "**/*.types.{ts,tsx}",
        "**/*.contract.{ts,tsx}",
        "**/*.protocol.{ts,tsx}",
        "**/*.interface.{ts,tsx}",
        "**/*.mock.{ts,tsx}",
        "**/*.mocks.{ts,tsx}",
        "**/*.test-util.ts",
        "**/types/**",
        "**/mocks/**",
        "**/__mocks__/**",
        "**/__tests__/**",
        "**/test-utils/**",
        "**/core/ports/**",
        "**/db/**",
        "**/scripts/**",
        "**/adapters-index-*.ts",
        "**/adapters/index.ts",
        "**/adapters/d1/**",
        "**/adapters/sqlite/**",
        "**/components/ui/**",
        "**/app/api/auth/**",
      ],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
