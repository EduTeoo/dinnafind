const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Ensure proper module resolution
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

// Add extra node modules
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  querystring: require.resolve('querystring-es3'),
};

// Reset cache when restarting the bundler
config.resetCache = true;

module.exports = config;
