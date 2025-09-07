import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './e2e',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@decorators/(.*)': '<rootDir>/../../src/decorators/$1',
    '^@global-modules/(.*)': '<rootDir>/../../src/global-modules/$1',
  },
};

export default config;
