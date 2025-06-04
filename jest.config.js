/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Jest configuration for DreamState Test Suite - Emotional Sovereignty Testing Focus"
 * @purpose Configure Jest for DreamState-only testing with legacy test exclusion and enhanced emotional sovereignty validation
 */

/* eslint-env node */
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // 🎯 DREAMSTATE FOCUS: Only test DreamState suite and supporting infrastructure
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  
  // 🎯 FOCUSED TEST PATTERNS: DreamState tests only
  testMatch: [
    // DreamState tests - our revolutionary emotional sovereignty test suite
    '**/tests/dreamstate/**/*.test.ts',
    '**/tests/dreamstate/**/*.test.js',
    
    // MCP remediation tests - for prompt issues resolution
    '**/tests/prompts/**/*.test.ts',
    
    // Supporting infrastructure tests
    '**/src/**/*.test.ts',
    '**/src/**/*.test.js'
  ],
  
  // 🚫 EXCLUDE LEGACY TESTS: Prevent legacy pre-Codex tests from running
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.jest-cache/',
    
    // Legacy pre-Codex tests - archived to prevent interference
    '/tests/archive/',
    '/tests/__snapshots__/',
    
    // Infrastructure directories that may contain test-like files
    '/api-router/',
    '/cursor/',
    '/webflow/',
    '/automations/',
    '/scripts/',
    '/utils/',
    '/temp/',
    '/coverage/',
    
    // Build and deployment directories
    '/dist/',
    '/build/',
    '/.next/',
    
    // Configuration and documentation
    '/docs/',
    '/config/',
    '/.github/'
  ],
  
  // 📁 MODULE RESOLUTION: Support for DreamState infrastructure
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@dreamstate/(.*)$': '<rootDir>/tests/dreamstate/$1'
  },
  
  // 🔧 TYPESCRIPT CONFIGURATION
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  
  // 📊 COVERAGE CONFIGURATION: Focus on DreamState infrastructure
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'tests/dreamstate/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/coverage/**'
  ],
  
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // ⚡ PERFORMANCE OPTIMIZATION
  maxWorkers: '50%',
  testTimeout: 30000,
  
  // 🧪 TEST SETUP
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // 📝 REPORTING
  verbose: false,
  
  // 🎯 DREAMSTATE-SPECIFIC CONFIGURATION
  // ts-jest configuration now handled in transform section above
  
  // 🔍 SNAPSHOT CONFIGURATION
  snapshotSerializers: [],
  
  // 🚨 ERROR HANDLING
  errorOnDeprecated: false,
  
  // 🎯 DREAMSTATE TEST ENVIRONMENT
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  },
  
  // Optimize for DreamState test performance
  cache: true,
  cacheDirectory: '.jest-cache',
  
  // Enhanced error reporting for emotional sovereignty tests
  bail: false,
  
  // Module resolution for emotional sovereignty infrastructure
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
