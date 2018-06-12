const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const getGitInfo = require('git-repo-info');
const pkg = require('../package.json');

const extractVender = new ExtractTextPlugin('vender.[hash].css');
const extractCSS = new ExtractTextPlugin('worldcup.[hash].css');

const git = getGitInfo();

const base = path.resolve(__dirname, '..');

const type = {
  image: [/\.(bmp|gif|jpe?g|png|svg)$/],
  font: [/\.(woff|woff2|ttf|eot|svg)(\?t=[0-9]+)?$/],
  html: [/\.html$/],
  json: [/\.json$/],
  source: [/\.(js|jsx)$/],
  style: [/\.css$/],
};

module.exports = {
  context: base,

  devtool: 'source-map',

  entry: {
    worldcup: [
      './src/polyfill.js',
      './src/index.js',
    ],
    vendor: Object.keys(pkg.dependencies),
  },

  output: {
    path: path.resolve(base, 'build'),
    filename: 'worldcup.[hash].js',
    publicPath: '/static/worldcup/',
  },

  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },

  mode: 'production',

  module: {
    rules: [{
      exclude: [
        ...type.html,
        ...type.json,
        ...type.image,
        ...type.source,
        ...type.style,
      ],
      loader: 'file-loader',
      options: {
        name: 'static/media/[name].[hash:8].[ext]',
      },
    }, {
      test: type.image,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]',
      },
    }, {
      test: type.source,
      include: [path.resolve(base, 'src')],
      loader: 'babel-loader',
    }, {
      test: type.style,
      include: /node_modules/,
      use: extractVender.extract({
        fallback: 'style-loader',
        use: {
          loader: 'css-loader',
          options: {
            minimize: true,
          },
        },
      }),
    }, {
      test: type.style,
      include: [path.resolve(base, 'src')],
      use: extractCSS.extract([{
        loader: 'css-loader',
        options: {
          import: false,
          importLoaders: 1,
          localIdentName: '[name]_[local]__[hash:base64:5]',
          modules: true,
          sourceMap: true,
        },
      }, {
        loader: 'postcss-loader',
        options: {
          config: { path: path.resolve(base, 'config/postcss.config.js') },
          sourceMap: true,
        },
      }]),
    }],
  },

  plugins: [
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false, // <-------- DISABLE redux-devtools HERE
      __GIT_REVISION__: JSON.stringify(git.sha),
      __ROLLBAR_ACCESS_TOKEN__: JSON.stringify(pkg.rollbar),
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    extractVender,
    extractCSS,
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(base, 'public/index.html'),
      minify: {
        collapseWhitespace: true,
        minifyCSS: true,
      },
    }),
  ],

  resolve: {
    modules: [
      path.resolve(base, 'src'),
      'node_modules',
    ],
    extensions: ['.js', '.jsx', '.json'],
  },
};
