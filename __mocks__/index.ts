// Mock utilities for tests
export const createMockVenue = (overrides = {}) => ({
  fsq_id: 'mock-venue-id',
  name: 'Mock Venue',
  categories: [
    {
      id: 13000,
      name: 'Restaurant',
      icon: {
        prefix: 'https://ss3.4sqi.net/img/categories_v2/food/default_',
        suffix: '.png',
      },
    },
  ],
  location: {
    address: '123 Test St',
    locality: 'Austin',
    region: 'TX',
  },
  distance: 100,
  rating: 4.5,
  geocodes: {
    main: {
      latitude: 30.2672,
      longitude: -97.7431,
    },
  },
  ...overrides,
});

export const createMockSearchResponse = (venues = [createMockVenue()]) => ({
  results: venues,
});

export const createMockCoordinates = (overrides = {}) => ({
  latitude: 30.2672,
  longitude: -97.7431,
  ...overrides,
});
