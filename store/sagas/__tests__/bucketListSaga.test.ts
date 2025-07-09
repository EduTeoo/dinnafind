import { watchBucketList } from '@/bucketListSaga';
import {
  fetchBucketList,
  fetchBucketListSuccess,
  fetchBucketListFailure,
  addToBucketList,
  removeFromBucketList,
  markAsVisited,
} from '@/store/slices/bucketListSlice';

// Mock foursquare service
jest.mock('@/api/foursquare', () => ({
  foursquareService: {
    getVenueDetails: jest.fn(),
  },
}));

// Import after mocking
import { foursquareService } from '@/api/foursquare';

describe('bucketListSaga', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('action creators', () => {
    it('should have all required action creators', () => {
      expect(fetchBucketList).toBeDefined();
      expect(fetchBucketListSuccess).toBeDefined();
      expect(fetchBucketListFailure).toBeDefined();
      expect(addToBucketList).toBeDefined();
      expect(removeFromBucketList).toBeDefined();
      expect(markAsVisited).toBeDefined();
    });

    it('should create fetchBucketList action', () => {
      const action = fetchBucketList();
      expect(action.type).toBe('bucketList/fetchBucketList');
    });

    it('should create addToBucketList action with venue data', () => {
      const venue = {
        id: 'venue123',
        name: 'Test Restaurant',
        location: { address: '123 Test St' },
        categories: [{ name: 'Restaurant' }],
      };

      const action = addToBucketList(venue);
      expect(action.type).toBe('bucketList/addToBucketList');
      expect(action.payload).toEqual(venue);
    });

    it('should create removeFromBucketList action', () => {
      const action = removeFromBucketList('item123');
      expect(action.type).toBe('bucketList/removeFromBucketList');
      expect(action.payload).toBe('item123');
    });

    it('should create markAsVisited action', () => {
      const visitData = {
        id: 'item123',
        rating: 5,
        review: 'Great place!',
      };

      const action = markAsVisited(visitData);
      expect(action.type).toBe('bucketList/markAsVisited');
      expect(action.payload).toEqual(visitData);
    });
  });

  describe('fetchBucketListSuccess action', () => {
    it('should create success action with items', () => {
      const items = [
        {
          id: 'item1',
          venue: {
            id: 'venue1',
            name: 'Restaurant 1',
            category: 'Restaurant',
            address: '123 Test St',
          },
          addedAt: Date.now(),
          notes: '',
          tags: [],
          priority: 'medium' as const,
        },
      ];

      const action = fetchBucketListSuccess(items);
      expect(action.type).toBe('bucketList/fetchBucketListSuccess');
      expect(action.payload).toEqual(items);
    });
  });

  describe('error handling', () => {
    it('should create failure action with error message', () => {
      const errorMessage = 'Failed to fetch bucket list';
      const action = fetchBucketListFailure(errorMessage);

      expect(action.type).toBe('bucketList/fetchBucketListFailure');
      expect(action.payload).toBe(errorMessage);
    });
  });

  describe('venue integration', () => {
    it('should handle venue with different ID formats', () => {
      const venueWithFsqId = {
        fsq_id: 'venue456',
        name: 'FSQ Restaurant',
        location: { address: '456 FSQ St' },
        categories: [{ name: 'Restaurant' }],
      };

      const action = addToBucketList(venueWithFsqId);
      expect(action.payload.fsq_id).toBe('venue456');
    });

    it('should handle venue with standard ID', () => {
      const venueWithId = {
        id: 'venue789',
        name: 'Standard Restaurant',
        location: { address: '789 Standard St' },
        categories: [{ name: 'Restaurant' }],
      };

      const action = addToBucketList(venueWithId);
      expect(action.payload.id).toBe('venue789');
    });
  });

  describe('saga watcher', () => {
    it('should export watchBucketList function', () => {
      expect(watchBucketList).toBeDefined();
      expect(typeof watchBucketList).toBe('function');
    });
  });

  describe('mock service integration', () => {
    it('should have mocked foursquare service', () => {
      expect(foursquareService.getVenueDetails).toBeDefined();
      expect(jest.isMockFunction(foursquareService.getVenueDetails)).toBe(true);
    });
  });
});
