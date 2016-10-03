var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}

function getLoaders(isTest) {
	// awesome-typescript-loader needs to output inlineSourceMap for
	// - code coverage to work with source maps.
	// - google closure compiler
  var atlOptions = 'inlineSourceMap=true&sourceMap=false';
  var preLoaders = [];
  var tsExclude = [];

  isTest = !! isTest;

  if (isTest) {
    tsExclude.push(/\.(e2e)\.ts$/);
  } else {
    tsExclude.push(/\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/);

    preLoaders.push({
      test: /\.ts$/,
      loader: 'tslint'
    });
  }

  return [
    // Support for .ts files.
    {
      test: /\.ts$/,
      loaders: ['awesome-typescript-loader?' + atlOptions, 'angular2-template-loader', '@angularclass/hmr-loader'],
      exclude: tsExclude
    },

    // copy those assets to output
    {
      test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file?name=fonts/[name].[hash].[ext]?'
    },

    // Support for *.json files.
    {
      test: /\.json$/,
      loader: 'json'
    },

    // Support for CSS as raw text
    // use 'null' loader in test mode (https://github.com/webpack/null-loader)
    // all css in src/style will be bundled in an external css file
    {
      test: /\.css$/,
      exclude: root('src', 'app'),
      loader: isTest ? 'null' : ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
    },
    // all css required in src/app files will be merged in js files
    {
      test: /\.css$/,
      include: root('src', 'app'),
      loader: 'raw!postcss'
    },

    // support for .scss files
    // use 'null' loader in test mode (https://github.com/webpack/null-loader)
    // all css in src/style will be bundled in an external css file
    {
      test: /\.scss$/,
      exclude: root('src', 'app'),
      loader: isTest ? 'null' : ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!sass')
    },
    // all css required in src/app files will be merged in js files
    {
      test: /\.scss$/,
      exclude: root('src', 'style'),
      loader: 'raw!postcss!sass'
    },

    // support for .html as raw text
    {
      test: /\.html$/,
      loader: 'raw',
      exclude: root('src', 'public')
    }
  ];
}

module.exports = {
  root: root,
  getLoaders: getLoaders
};
