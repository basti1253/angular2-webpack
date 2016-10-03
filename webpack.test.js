var path = require('path');
var webpack = require('webpack');
var config = require('./webpack.base');

const ENV = process.env.npm_lifecycle_event;
const testWatchMode = ENV === 'test:dev';

config.devtool = 'inline-source-map';
config.debug = false;

config.entry = {};
config.output = {};

config.resolve.cache = false;

if ( ! testWatchMode) {
  // instrument only testing sources with Istanbul, covers ts files
  config.module.postLoaders.push({
    test: /\.ts$/,
    include: path.resolve('src'),
    loader: 'istanbul-instrumenter-loader',
    exclude: [
      /\.spec\.ts$/,
      /\.e2e\.ts$/,
      /node_modules/
    ]
  });
}

/**
 * @override
 */
config.plugins = [
  // Define env variables to help with builds
  // @see https://webpack.github.io/docs/list-of-plugins.html#defineplugin
  new webpack.DefinePlugin({
    // Environment helpers
    'process.env': {
      ENV: JSON.stringify(ENV)
    }
  })
];

module.exports = config;
