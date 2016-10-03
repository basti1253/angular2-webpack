// var path = require('path');
var webpack = require('webpack');
var pkg = require('./package.json');
var utils = require('./webpack.utils');
var root = utils.root;
var getLoaders = utils.getLoaders;

// Webpack Plugins
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
const ENV = process.env.npm_lifecycle_event;
const testWatchMode = ENV === 'test:dev';
const isTest = ENV === 'test' || testWatchMode;
const isProd = ENV === 'build';

/**
 * Config
 * @see http://webpack.github.io/docs/configuration.html
 * This is the object where all configuration gets set
 */
var config = {};

/**
 * Entry
 * Reference: http://webpack.github.io/docs/configuration.html#entry
 */
config.entry = {
  'polyfills': './src/polyfills.ts',
  'vendor': './src/vendor.ts',
  'app': './src/main.ts' // our angular app
};

/**
 * Output
 * Reference: http://webpack.github.io/docs/configuration.html#output
 */
config.output = {
  path: root('dist'),
  publicPath: pkg.dev.url,
  filename: 'js/[name].js',
  chunkFilename: '[id].chunk.js'
};

/**
 * Resolve
 * @see http://webpack.github.io/docs/configuration.html#resolve
 */
config.resolve = {
  cache: true,
  root: root(),
  extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html'],
  alias: {
    'app': 'src/app'
  }
};


/**
 * Loaders
 * @see http://webpack.github.io/docs/configuration.html#module-loaders
 * @see http://webpack.github.io/docs/list-of-loaders.html
 * This handles most of the magic responsible for converting modules
 */
config.module = {
  preLoaders: [],
  loaders: getLoaders(isTest),
  postLoaders: []
};

/**
 * Plugins
 * @see http://webpack.github.io/docs/configuration.html#plugins
 * List: http://webpack.github.io/docs/list-of-plugins.html
 */
config.plugins = [
  // Define env variables to help with builds
  // @see https://webpack.github.io/docs/list-of-plugins.html#defineplugin
  new webpack.DefinePlugin({
    // Environment helpers
    'process.env': {
      ENV: JSON.stringify(ENV)
    }
  }),

  new ForkCheckerPlugin(),

  // Generate common chunks if necessary
  // Reference: https://webpack.github.io/docs/code-splitting.html
  // Reference: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
  new CommonsChunkPlugin({
    name: [
      'vendor',
      'polyfills'
    ]
  }),

  // Inject script and link tags into html files
  // Reference: https://github.com/ampedandwired/html-webpack-plugin
  new HtmlWebpackPlugin({
    template: './src/index.html',
    chunksSortMode: 'dependency'
  }),

  // Extract css files
  // Reference: https://github.com/webpack/extract-text-webpack-plugin
  // Disabled when in test mode or not in build mode
  new ExtractTextPlugin('css/[name].[hash].css', {
    disable: !isProd
  })
]

/**
 * PostCSS
 * @see https://github.com/postcss/autoprefixer-core
 * Add vendor prefixes to your css
 */
config.postcss = [
  autoprefixer({
    browsers: ['last 2 version']
  })
];

/**
 * Sass
 * @see https://github.com/jtangelder/sass-loader
 * Transforms .scss files to .css
 */
config.sassLoader = {
  //includePaths: [path.resolve(__dirname, "node_modules/foundation-sites/scss")]
};

/**
 * Apply the tslint loader as pre/postLoader
 * @see https://github.com/wbuchwalter/tslint-loader
 */
config.tslint = {
  emitErrors: false,
  failOnHint: false
};

/**
 * Dev server configuration
 * @see http://webpack.github.io/docs/configuration.html#devserver
 * @see http://webpack.github.io/docs/webpack-dev-server.html
 */
config.devServer = {
  contentBase: './src/assets',
  historyApiFallback: true,
  quiet: true,
  stats: 'minimal' // none (or false), errors-only, minimal, normal (or true) and verbose
};

module.exports = config;
