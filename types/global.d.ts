/// <reference types="expo-router/types" />

// Declare modules for image imports
declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.jpeg' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  const value: any;
  export default value;
}

// Global type declarations
declare global {
  var __DEV__: boolean;
  var selectedVenue: any;
  
  namespace NodeJS {
    interface Global {
      __DEV__: boolean;
      selectedVenue: any;
    }
  }
}

export {};
