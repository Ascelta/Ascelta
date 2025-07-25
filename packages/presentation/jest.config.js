module.exports = {
  preset: 'react-native',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community|react-native-.*|@react-navigation|react-navigation|@shopify/react-native.*|@tamagui|@react-native/js-polyfills)/)',
  ],
  moduleNameMapper: {
    '^@core/shared/(.*)$': '<rootDir>/../shared/src/$1',
    '^@core/infrastructure/(.*)$': '<rootDir>/../infrastructure/src/$1',
    '^@core/presentation/(.*)$': '<rootDir>/src/$1',
    '^@core/usecase/(.*)$': '<rootDir>/../usecase/src/$1',
    '^@core/domain/(.*)$': '<rootDir>/../domain/src/$1',
    '^@core/shared$': '<rootDir>/../shared/src',
    '^@core/infrastructure$': '<rootDir>/__mocks__/@core/infrastructure.js',
    '^@core/presentation$': '<rootDir>/src',
    '^@core/usecase$': '<rootDir>/__mocks__/@core/usecase.js',
    '^@core/domain$': '<rootDir>/__mocks__/@core/domain.js',
  },
};
