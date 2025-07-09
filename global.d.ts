/// <reference types="react" />
/// <reference types="react-native" />

declare global {
  namespace React {
    // Ensure ReactNode includes all valid types
    type ReactNode =
      | React.ReactElement
      | string
      | number
      | React.ReactFragment
      | React.ReactPortal
      | boolean
      | null
      | undefined;
  }

  // Extend Window interface for any custom properties if needed
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
  }
  // Global variable for passing venue data between screens
  const selectedVenue: any;
  var __DEV__: boolean | undefined;
}

export {};
