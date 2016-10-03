var webpack = require('webpack');
var config = require('./webpack.config.js');
var root = require('./webpack.utils').root;

var Md5HashPlugin = require('webpack-md5-hash');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ClosureCompilerPlugin = require('webpack-closure-compiler');
var NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
/**
 * Devtool
 * Reference: http://webpack.github.io/docs/configuration.html#devtool
 * Type of sourcemap to use per build type
 */
config.devtool = 'source-map';

config.debug = false;

config.output = {
  path: root('dist'),
  publicPath: '/',
  filename: 'js/[name].[chunkhash].js',
  chunkFilename: '[id].[chunkhash].chunk.js',
  sourceMapFilename: '[file].map',
};

config.plugins.push(

  // @see http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
  // Only emit files when there are no errors
  new webpack.NoErrorsPlugin(),

  /**
   * @see https://www.npmjs.com/package/webpack-md5-hash
   * Plugin to replace a standard webpack chunkhash with md5.
   */
  new Md5HashPlugin(),

  // @see http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
  // Dedupe modules in the output
  new webpack.optimize.DedupePlugin(),

  // @see http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
  // Minify all javascript, switch loaders to minimizing mode
	// new webpack.optimize.UglifyJsPlugin({
		// beautify: false,
		// mangle: { screw_ie8 : true, keep_fnames: true },
		// compress: {
		// 	screw_ie8: true,
		// 	drop_debugger: true,
		// 	unused: true
		// },
		// comments: false
	// }),
  new ClosureCompilerPlugin({
    compiler: {
      language_in: 'ECMASCRIPT5_STRICT',
      language_out: 'ECMASCRIPT5_STRICT',
			create_source_map: config.output.sourceMapFilename,
      // compilation_level: 'SIMPLE'
    },
    concurrency: 8
  }),
	/**
	 * Plugin: NormalModuleReplacementPlugin
	 * Description: Replace resources that matches resourceRegExp with newResource
	 *
	 * See: http://webpack.github.io/docs/list-of-plugins.html#normalmodulereplacementplugin
	 */

	new NormalModuleReplacementPlugin(
		/angular2-hmr/,
		root('build/angular2-hmr-prod.js')
	),

  // Copy assets from the assets folder
  // Reference: https://github.com/kevlened/copy-webpack-plugin
  new CopyWebpackPlugin([{
    from: root('src/assets')
  }])
);

module.exports = config;
