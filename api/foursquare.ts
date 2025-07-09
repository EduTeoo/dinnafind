//@ts-nocheck
import {
  type Coordinates,
  type VenueDetailsResponse,
  type VenueSearchParams,
  type VenueSearchResponse,
} from '@/models/venue';
import { FOURSQUARE_API_KEY, FOURSQUARE_API_URL } from '@/utils/env';

// Validate environment variables
if (!FOURSQUARE_API_KEY) {
  throw new Error('Foursquare API key must be defined in the environment variables');
}

/**
 * Foursquare API service using v3 API:
 * - TypeScript for type safety
 * - Environment variables for configuration
 * - Proper error handling
 * - Clean abstraction
 */
export class FoursquareService {
  private static instance: FoursquareService;
  private headers: HeadersInit;

  private constructor() {
    // Set up headers with API key for v3 API
    console.log('🔑 Initializing Foursquare with API key:', FOURSQUARE_API_KEY);
    this.headers = {
      Accept: 'application/json',
      Authorization: FOURSQUARE_API_KEY,
    };
  }

  /**
   * Get singleton instance of the service
   */
  public static getInstance(): FoursquareService {
    if (!FoursquareService.instance) {
      FoursquareService.instance = new FoursquareService();
    }
    return FoursquareService.instance;
  }

  /**
   * Search for venues near the specified location
   */
  public async searchVenues(params: VenueSearchParams): Promise<VenueSearchResponse> {
    try {
      const queryParams = new URLSearchParams({
        ll: params.ll,
        ...(params.query && { query: params.query }),
        ...(params.categories && { categories: params.categories }),
        ...(params.radius && { radius: params.radius.toString() }),
        limit: (params.limit || 20).toString(),
        ...(params.sort && { sort: params.sort }),
      });

      const response = await fetch(`${FOURSQUARE_API_URL}/places/search?${queryParams}`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP ${response.status} Error:`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        results: data.results || [],
        context: data.context || null,
        totalResults: data.totalResults || 0,
      };
    } catch (error: any) {
      console.error('❌ Failed to search venues:', error);
      throw error;
    }
  }

  /**
   * Find venues strictly by latitude and longitude
   */
  public async fetchVenues({ latitude, longitude }: Coordinates): Promise<any[]> {
    try {
      const response = await fetch(
        `${FOURSQUARE_API_URL}/places/search?ll=${latitude},${longitude}`,
        {
          method: 'GET',
          headers: this.headers,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP ${response.status} Error:`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error: any) {
      console.error('Failed to fetch venues:', error);
      throw error;
    }
  }

  /**
   * Get venue details by ID
   */
  public async getVenueDetails(venueId: string): Promise<VenueDetailsResponse> {
    try {
      const response = await fetch(`${FOURSQUARE_API_URL}/places/${venueId}`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP ${response.status} Error:`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error(`Failed to get venue details for ID ${venueId}:`, error);
      throw error;
    }
  }

  /**
   * Search venues near the user's current location
   */
  public async searchNearbyVenues(
    coordinates: Coordinates,
    query?: string,
    categories?: string[],
    radius = 4828,
    limit = 20
  ): Promise<VenueSearchResponse> {
    const params: VenueSearchParams = {
      ll: `${coordinates.latitude},${coordinates.longitude}`,
      radius,
      limit,
    };

    if (query) {
      params.query = query;
    }

    if (categories && categories.length > 0) {
      params.categories = categories.join(',');
    }

    return this.searchVenues(params);
  }

  /**
   * Get recommended venues near the specified location
   */
  public async getRecommendedVenues(
    coordinates: Coordinates,
    limit = 10
  ): Promise<VenueSearchResponse> {
    try {
      const queryParams = new URLSearchParams({
        ll: `${coordinates.latitude},${coordinates.longitude}`,
        limit: limit.toString(),
        sort: 'RATING',
      });

      const response = await fetch(`${FOURSQUARE_API_URL}/places/search?${queryParams}`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP ${response.status} Error:`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        results: data.results || [],
        context: data.context || null,
        totalResults: data.totalResults || 0,
      };
    } catch (error: any) {
      console.error('Failed to get recommended venues:', error);
      throw error;
    }
  }
}

export const foursquareService = FoursquareService.getInstance();
