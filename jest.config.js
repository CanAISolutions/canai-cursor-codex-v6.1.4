/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Jest configuration for TypeScript testing with Codex enforcement and Cursor memory safety"
 * @purpose Configure Jest for Cursor-aware, Codex-safe testing with support for JSON files and CI enforcement
 */

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/cursor'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      diagnostics: true,
      useESM: false
    }
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  verbose: true,
  testTimeout: 10000,

  // 🚦 Cursor Drift & JSON Memory Tests
  moduleNameMapper: {
    '^@cursor/(.*)$': '<rootDir>/cursor/$1'
  },

  // 🧠 Enable loading .json test assets (e.g., self-awareness.json)
  resolver: undefined,
  extensionsToTreatAsEsm: [],
};
