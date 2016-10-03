var config = require('./webpack.base');

config.devtool = 'eval-source-map';
config.debug = true;

config.module.preLoaders = [
  {
    test: /\.ts$/,
    loader: 'tslint'
  }
];

module.exports = config;
