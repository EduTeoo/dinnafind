import { foursquareService } from '@/api/foursquare';
import {
  fetchNearbyVenues,
  fetchNearbyVenuesFailure,
  fetchNearbyVenuesSuccess,
  fetchRecommendedVenues,
  fetchRecommendedVenuesFailure,
  fetchRecommendedVenuesSuccess,
  searchVenues,
  searchVenuesFailure,
  searchVenuesSuccess,
  selectVenue,
  setSelectedVenue,
} from '@/store/slices/venuesSlice';
import { handleFetchRecommendedVenues, watchVenues } from '@/venuesSaga';

// Mock foursquare service
jest.mock('@/api/foursquare', () => ({
  foursquareService: {
    searchNearbyVenues: jest.fn(),
    getRecommendedVenues: jest.fn(),
    getVenueDetails: jest.fn(),
  },
}));

describe('venuesSaga', () => {
  const mockCoordinates = {
    latitude: 30.2672,
    longitude: -97.7431,
  };

  const mockVenue = {
    id: 'venue123',
    fsq_id: 'venue123',
    name: 'Test Restaurant',
    location: {
      address: '123 Test St',
      locality: 'Austin',
      region: 'TX',
    },
    categories: [
      {
        id: '13000',
        name: 'Restaurant',
        icon: { prefix: '', suffix: '' },
      },
    ],
    distance: 150,
    geocodes: {
      main: { latitude: 30.2672, longitude: -97.7431 },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('action creators', () => {
    it('should create fetchNearbyVenues action', () => {
      const action = fetchNearbyVenues({
        coordinates: mockCoordinates,
        radius: 4828,
      });

      expect(action.type).toBe('venues/fetchNearbyVenues');
      expect(action.payload.coordinates).toEqual(mockCoordinates);
    });

    it('should create fetchRecommendedVenues action', () => {
      const action = fetchRecommendedVenues({
        coordinates: mockCoordinates,
        limit: 10,
      });

      expect(action.type).toBe('venues/fetchRecommendedVenues');
      expect(action.payload.coordinates).toEqual(mockCoordinates);
      expect(action.payload.limit).toBe(10);
    });

    it('should create searchVenues action', () => {
      const action = searchVenues({
        coordinates: mockCoordinates,
        query: 'pizza',
        radius: 4828,
      });

      expect(action.type).toBe('venues/searchVenues');
      expect(action.payload.query).toBe('pizza');
      expect(action.payload.coordinates).toEqual(mockCoordinates);
    });

    it('should create selectVenue action', () => {
      const action = selectVenue('venue123');
      expect(action.type).toBe('venues/selectVenue');
      expect(action.payload).toBe('venue123');
    });
  });

  describe('success actions', () => {
    it('should create success actions with venue data', () => {
      const venues = [mockVenue];

      const nearbyAction = fetchNearbyVenuesSuccess(venues);
      expect(nearbyAction.type).toBe('venues/fetchNearbyVenuesSuccess');
      expect(nearbyAction.payload).toEqual(venues);

      const recommendedAction = fetchRecommendedVenuesSuccess(venues);
      expect(recommendedAction.type).toBe('venues/fetchRecommendedVenuesSuccess');
      expect(recommendedAction.payload).toEqual(venues);

      const searchAction = searchVenuesSuccess(venues);
      expect(searchAction.type).toBe('venues/searchVenuesSuccess');
      expect(searchAction.payload).toEqual(venues);

      const selectedAction = setSelectedVenue(mockVenue);
      expect(selectedAction.type).toBe('venues/setSelectedVenue');
      expect(selectedAction.payload).toEqual(mockVenue);
    });
  });

  describe('failure actions', () => {
    it('should create failure actions with error messages', () => {
      const error = 'API Error';

      const nearbyAction = fetchNearbyVenuesFailure(error);
      expect(nearbyAction.type).toBe('venues/fetchNearbyVenuesFailure');
      expect(nearbyAction.payload).toBe(error);

      const recommendedAction = fetchRecommendedVenuesFailure(error);
      expect(recommendedAction.type).toBe('venues/fetchRecommendedVenuesFailure');
      expect(recommendedAction.payload).toBe(error);

      const searchAction = searchVenuesFailure(error);
      expect(searchAction.type).toBe('venues/searchVenuesFailure');
      expect(searchAction.payload).toBe(error);
    });
  });

  describe('service mocking', () => {
    it('should have mocked foursquare service methods', () => {
      expect(foursquareService.searchNearbyVenues).toBeDefined();
      expect(foursquareService.getRecommendedVenues).toBeDefined();
      expect(foursquareService.getVenueDetails).toBeDefined();

      expect(jest.isMockFunction(foursquareService.searchNearbyVenues)).toBe(true);
      expect(jest.isMockFunction(foursquareService.getRecommendedVenues)).toBe(true);
      expect(jest.isMockFunction(foursquareService.getVenueDetails)).toBe(true);
    });
  });

  describe('venue data handling', () => {
    it('should handle venue with different ID formats', () => {
      const venueWithFsqId = { ...mockVenue, id: undefined };
      const action = setSelectedVenue(venueWithFsqId);
      expect(action.payload.fsq_id).toBe('venue123');
    });

    it('should handle venue categories', () => {
      const action = searchVenues({
        coordinates: mockCoordinates,
        query: 'restaurant',
        categories: ['13000', '13001'],
      });

      expect(action.payload.categories).toEqual(['13000', '13001']);
    });
  });

  describe('saga setup', () => {
    it('should export watchVenues function', () => {
      expect(watchVenues).toBeDefined();
      expect(typeof watchVenues).toBe('function');
    });

    it('should export handleFetchRecommendedVenues for testing', () => {
      expect(handleFetchRecommendedVenues).toBeDefined();
      expect(typeof handleFetchRecommendedVenues).toBe('function');
    });
  });
});
