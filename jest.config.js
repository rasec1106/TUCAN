/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/build/'], // Ignore build folder  
  // testMatch: ['**/tests/**/*.test.ts'],
  testMatch: ['**/src/tests/**/*.test.ts', '**/src/tests/**/*.spec.ts'], // Match .test.ts and .spec.ts files in src/tests  
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/index.ts'
  ],
  coverageDirectory: 'coverage'
}
