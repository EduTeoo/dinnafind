// Mock for expo-constants
module.exports = {
  // Mock Expo Constants
  expoConfig: {
    extra: {
      FOURSQUARE_CLIENT_ID: 'mock-client-id',
      FOURSQUARE_CLIENT_SECRET: 'mock-client-secret',
      FOURSQUARE_API_KEY: 'mock-api-key',
    },
  },

  // Mock app config
  appOwnership: 'standalone',
  experienceUrl: 'exp://localhost:19000',
  sessionId: 'mock-session-id',

  // Default mock for any other constants properties
  default: {
    expoConfig: {
      extra: {
        FOURSQUARE_CLIENT_ID: 'mock-client-id',
        FOURSQUARE_CLIENT_SECRET: 'mock-client-secret',
        FOURSQUARE_API_KEY: 'mock-api-key',
      },
    },
  },
};
