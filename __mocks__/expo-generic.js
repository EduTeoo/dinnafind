// Generic mock for any expo module not specifically mocked
module.exports = {
  // Default mock implementation
  default: {},

  // Mock common expo module exports
  __esModule: true,

  // Generic function mock
  mockFunction: jest.fn(),

  // Mock constants object
  Constants: {},

  // Mock for any expo module function calls
  [Symbol.for('mock')]: jest.fn(),
};
