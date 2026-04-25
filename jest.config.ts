import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src',
  testMatch: ['**/__tests__/**/*.spec.ts'],
  moduleNameMapper: {
    '^p-limit$': '<rootDir>/../__mocks__/p-limit.cjs',
  },
  coverageDirectory: '../coverage',
  collectCoverageFrom: [
    'modules/**/use-cases/**/*.ts',
    'modules/**/mappers/**/*.ts',
    'shared/domain/**/*.ts',
    '!**/__tests__/**',
    '!**/index.ts',
  ],
  coverageThreshold: {
    global: { lines: 80, functions: 80, branches: 75 },
  },
};

export default config;
