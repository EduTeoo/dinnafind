// Direct configuration for Foursquare API
// This ensures the values are available regardless of environment loading issues

export const FOURSQUARE_CONFIG = {
  // API Keys - Update these with your actual values
  API_KEY: 'fsq36FEPfDna8FEIc6x4QcQ3Kl+DsUIZ+goGfv1jqdtplbs=',
  CLIENT_ID: '0EB5JC4WFWHKXIY4BWR3UMHLOCCQ4M1UNKKFNUDFA5JKV3VM',
  CLIENT_SECRET: 'NF3HSWXWJGJKG40YM4BIWELNWHZISLKR4KTYZPB3WSZXAGM0',

  // API URLs
  V3_API_URL: 'https://api.foursquare.com/v3',
  V2_API_URL: 'https://api.foursquare.com/v2',
};

// Export for compatibility with existing code
export const FOURSQUARE_API_KEY = FOURSQUARE_CONFIG.API_KEY;
export const FOURSQUARE_CLIENT_ID = FOURSQUARE_CONFIG.CLIENT_ID;
export const FOURSQUARE_CLIENT_SECRET = FOURSQUARE_CONFIG.CLIENT_SECRET;
export const FOURSQUARE_API_URL = FOURSQUARE_CONFIG.V3_API_URL;
