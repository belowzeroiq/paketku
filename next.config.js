const path = require('path');

module.exports = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, 'components'),
      '@app-types': path.resolve(__dirname, 'app-types'),
      '@styles': path.resolve(__dirname, 'styles')
    };
    return config;
  }
};