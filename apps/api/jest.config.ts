import type { Config } from 'jest';

const config: Config = {
  setupFiles: ['./jest-setup.ts'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  roots: ['src', 'test'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  prettierPath: null,
  moduleNameMapper: {
    '^@decorators/(.*)': '<rootDir>/src/decorators/$1',
    '^@global-modules/(.*)': '<rootDir>/src/global-modules/$1',
  },
};

export default config;
