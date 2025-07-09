// Test API service logic without MSW - directly mock the methods
import { createMockVenue, createMockSearchResponse } from '@/__mocks__';
import { foursquareV3Service } from '@/foursquareV3';

// Mock the entire module
jest.mock('@/foursquareV3', () => ({
  foursquareV3Service: {
    searchNearbyVenues: jest.fn(),
    getRecommendedVenues: jest.fn(),
    getVenueDetails: jest.fn(),
    searchVenues: jest.fn(),
  },
}));

// Type the mocked service
const mockedFoursquareV3Service = foursquareV3Service as jest.Mocked<typeof foursquareV3Service>;

describe('FoursquareV3Service (Mocked)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle venue search successfully', async () => {
    const mockVenue = createMockVenue();
    const mockResponse = createMockSearchResponse([mockVenue]);

    mockedFoursquareV3Service.searchNearbyVenues.mockResolvedValue(mockResponse);

    const result = await mockedFoursquareV3Service.searchNearbyVenues(
      {
        latitude: 30.2672,
        longitude: -97.7431,
      },
      'restaurant'
    );

    expect(result.results).toHaveLength(1);
    expect(result.results[0].name).toBe('Mock Venue');
  });

  it('should handle venue details successfully', async () => {
    const mockVenue = createMockVenue({ name: 'Detailed Venue' });

    mockedFoursquareV3Service.getVenueDetails.mockResolvedValue(mockVenue);

    const result = await mockedFoursquareV3Service.getVenueDetails('mock-venue-id');

    expect(result.name).toBe('Detailed Venue');
    expect(result.fsq_id).toBe('mock-venue-id');
  });

  it('should handle recommended venues successfully', async () => {
    const mockVenues = [
      createMockVenue({ name: 'Top Venue 1' }),
      createMockVenue({ name: 'Top Venue 2' }),
    ];
    const mockResponse = createMockSearchResponse(mockVenues);

    mockedFoursquareV3Service.getRecommendedVenues.mockResolvedValue(mockResponse);

    const result = await mockedFoursquareV3Service.getRecommendedVenues({
      latitude: 30.2672,
      longitude: -97.7431,
    });

    expect(result.results).toHaveLength(2);
    expect(result.results[0].name).toBe('Top Venue 1');
    expect(result.results[1].name).toBe('Top Venue 2');
  });
});
