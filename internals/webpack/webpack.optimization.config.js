const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');

function getOptimizationConfig(o) {
  let CONFIG = {
    plugins: [],
  };

  if (o.isProd && o.compress) {
    CONFIG.plugins.push(
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
    );
  }

  let htmlWebpackPlugin;
  if (o.compressHtml && o.isProd) {
    htmlWebpackPlugin = new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        removeAttributeQuotes: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    });
  } else {
    htmlWebpackPlugin = new HtmlWebpackPlugin({
      template: './src/index.html',
    });
  }

  CONFIG.plugins.push(htmlWebpackPlugin);

  const splitChunks = o.splitChunks
    ? {
        chunks: 'all',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        name: true,
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
          main: {
            chunks: 'all',
            minChunks: 2,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      }
    : undefined;

  if (o.isProd) {
    const terserPlugin = new TerserPlugin({
      terserOptions: {
        warnings: false,
        compress: {
          comparisons: false,
        },
        parse: {},
        mangle: true,
        output: {
          comments: false,
          ascii_only: true,
          beautify: false,
          ecma: 6,
        },
      },
      parallel: true,
      cache: true,
      sourceMap: true,
    });

    const optimizeCssAssetsWebpackPlugin = new OptimizeCssAssetsWebpackPlugin({
      cssProcessorOptions: o.stylesSourceMap
        ? {
            map: {inline: true},
          }
        : undefined,
    });

    CONFIG.optimization = {
      minimize: true,
      minimizer: [terserPlugin, optimizeCssAssetsWebpackPlugin],
      sideEffects: true,
      concatenateModules: true,
      splitChunks,
      runtimeChunk: false,
    };
  } else {
    CONFIG.optimization = {
      minimize: false,
      splitChunks,
      runtimeChunk: false,
    };
  }

  if (o.buildStats) {
    CONFIG.plugins.push(
      new LoadablePlugin({
        filename: 'program/stats.json',
      }),
    );
  }

  return CONFIG;
}

module.exports = getOptimizationConfig;
