// Mock for expo-location
module.exports = {
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({
    status: 'granted',
    granted: true,
  }),

  getForegroundPermissionsAsync: jest.fn().mockResolvedValue({
    status: 'granted',
    granted: true,
  }),

  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 30.2672,
      longitude: -97.7431,
      altitude: null,
      accuracy: 5,
      heading: null,
      speed: null,
    },
    timestamp: Date.now(),
  }),

  watchPositionAsync: jest.fn().mockResolvedValue({
    remove: jest.fn(),
  }),

  // Constants
  Accuracy: {
    Lowest: 1,
    Low: 2,
    Balanced: 3,
    High: 4,
    Highest: 5,
    BestForNavigation: 6,
  },

  LocationAccuracy: {
    Lowest: 1,
    Low: 2,
    Balanced: 3,
    High: 4,
    Highest: 5,
    BestForNavigation: 6,
  },
};
