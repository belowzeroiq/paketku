const path = require('path');

module.exports = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, 'components'),
      '@types': path.resolve(__dirname, 'types'),
      '@styles': path.resolve(__dirname, 'styles')
    };
    return config;
  }
};