// Test environment utilities separately
describe('Environment Configuration', () => {
  it('should load environment variables', () => {
    // Test that we can import the env utils without errors
    const envModule = require('@/utils/env');

    expect(envModule.FOURSQUARE_API_KEY).toBeDefined();
    expect(envModule.FOURSQUARE_API_URL).toBeDefined();
    expect(envModule.FOURSQUARE_CLIENT_ID).toBeDefined();
    expect(envModule.FOURSQUARE_CLIENT_SECRET).toBeDefined();
  });

  it('should have expected API URL', () => {
    const { FOURSQUARE_API_URL } = require('@/utils/env');
    expect(FOURSQUARE_API_URL).toBe('https://api.foursquare.com/v3');
  });

  it('should load environment variables with proper types', () => {
    const {
      FOURSQUARE_API_KEY,
      FOURSQUARE_CLIENT_ID,
      FOURSQUARE_CLIENT_SECRET,
      FOURSQUARE_API_URL,
    } = require('@/utils/env');

    expect(typeof FOURSQUARE_API_KEY).toBe('string');
    expect(typeof FOURSQUARE_CLIENT_ID).toBe('string');
    expect(typeof FOURSQUARE_CLIENT_SECRET).toBe('string');
    expect(typeof FOURSQUARE_API_URL).toBe('string');
  });
});
