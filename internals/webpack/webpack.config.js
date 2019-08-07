const path = require('path');
const merge = require('webpack-merge');
const getStylesConfig = require('./webpack.styles.config');
const getScriptsConfig = require('./webpack.scripts.config');
const getOptimizationConfig = require('./webpack.optimization.config');
const getAssetConfig = require('./webpack.asset.config');
const getAppConfig = require('./webpack.app.config');

const isProd = process.env.NODE_ENV === 'production';
const setting = require('./_setting.js')(isProd);

let CONFIG;
const modules = ['node_modules'];

CONFIG = {
  entry: [path.join(process.cwd(), 'src/index.js')],
  output: {
    path: path.join(process.cwd(), 'dist'),
    publicPath: '',
    filename: 'js/[name].[hash:7].js'
  },
  resolve: {
    modules
  },
  resolveLoader: {
    modules
  }
};

CONFIG = merge(
  CONFIG,
  getOptimizationConfig(setting),
  getStylesConfig(setting),
  getScriptsConfig(setting),
  getAssetConfig(setting),
  getAppConfig(setting)
);

module.exports = CONFIG;
