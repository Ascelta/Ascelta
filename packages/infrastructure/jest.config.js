module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@core/infrastructure/(.*)$': '<rootDir>/src/$1',
    '^@core/domain/(.*)$': '<rootDir>/../domain/src/$1',
    '^@core/usecase/(.*)$': '<rootDir>/../usecase/src/$1',
    '^@core/shared/(.*)$': '<rootDir>/../shared/src/$1',
    '^@core/presentation/(.*)$': '<rootDir>/../presentation/src/$1',
  },
};
