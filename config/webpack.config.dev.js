const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getGitInfo = require('git-repo-info');
const internalIp = require('internal-ip');

const git = getGitInfo();
const host = internalIp.v4.sync();
const port = 4000;

const base = path.resolve(__dirname, '..');

const type = {
  image: [/\.(bmp|gif|jpe?g|png|svg)$/],
  html: [/\.html$/],
  json: [/\.json$/],
  source: [/\.(js|jsx)$/],
  style: [/\.css$/],
};

module.exports = {
  context: base,

  devtool: 'cheap-module-eval-source-map',

  entry: [
    './src/polyfill.js',
    './src/index.js',
  ],

  output: {
    path: path.resolve(base, 'dist'),
    filename: 'worldcup.js',
    publicPath: '/',
  },

  mode: 'development',

  devServer: {
    contentBase: path.resolve(base, 'public'),
    historyApiFallback: true,
    host,
    hot: true,
    port,
  },

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
      options: { name: 'static/media/[name].[hash:8].[ext]' },
    }, {
      test: type.image,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]',
      },
    }, {
      test: type.source,
      loader: 'babel-loader',
    }, {
      test: type.style,
      include: [/node_modules/],
      use: ['style-loader', 'css-loader'],
    }, {
      test: type.style,
      include: [/milhouse/, path.resolve(base, 'src')],
      use: ['style-loader', {
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
      }],
    }],
  },

  plugins: [
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true, // <-------- DISABLE redux-devtools HERE
      __GIT_REVISION__: JSON.stringify(git.sha),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(base, 'public/index.html'),
    }),
  ],

  resolve: {
    alias: {
      component: 'antd',
    },
    modules: [
      path.resolve(base, 'src'),
      'node_modules',
    ],
    extensions: ['.js', '.jsx', '.json'],
  },
};
