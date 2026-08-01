import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/src/types/",
    "<rootDir>/src/db/schema.ts",
    "<rootDir>/src/db/index.ts",
    "<rootDir>/src/db/client.ts",
    "<rootDir>/src/lib/auth.ts",
    "<rootDir>/src/lib/auth-client.ts",
    "<rootDir>/src/proxy.ts",
    "<rootDir>/src/app/api/auth/",
  ],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default createJestConfig(config);
