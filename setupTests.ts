
// Mock expo-constants for tests
(globalThis as any).jest = {
  mock: (moduleName: string, factory: () => any) => {
    // Mock implementation
  }
};

(globalThis as any).jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {
        FOURSQUARE_API_KEY: 'test-api-key',
        FOURSQUARE_CLIENT_ID: 'test-client-id',
        FOURSQUARE_CLIENT_SECRET: 'test-client-secret',
      },
    },
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.FOURSQUARE_API_KEY = 'test-api-key';
process.env.FOURSQUARE_CLIENT_ID = 'test-client-id';
process.env.FOURSQUARE_CLIENT_SECRET = 'test-client-secret';

// Extend the NodeJS global type to include __DEV__

// Global test setup
;(globalThis as any).__DEV__ = false;
