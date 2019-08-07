const webpack = require('webpack');
const path = require('path');
const OfflinePlugin = require('offline-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = function getAppConfig(o) {
  let CONFIG = {
    plugins: [],
  };

  if (o.isProd) {
    CONFIG.mode = 'production';
    CONFIG.performance = {
      assetFilter: assetFilename => !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
    };
  } else {
    CONFIG.mode = 'development';
    CONFIG.devtool = 'eval-source-map';
    CONFIG.plugins.push(
      new CircularDependencyPlugin({
        exclude: /a\.js|node_modules/,
        failOnError: false,
      }),
    );

    CONFIG.performance = {
      hints: false,
    };
  }

  if (o.serviceWorker && o.isProd) {
    CONFIG.plugins.push(
      new OfflinePlugin({
        relativePaths: false,
        publicPath: '/',
        appShell: '/',
        excludes: ['.htaccess'],
        safeToUseOptionalCaches: true,
        ServiceWorker: {
          output: 'service-worker.js', //无法有效输出到文件夹
          minify: true,
        },
      }),
    );
  }

  if (o.pwa && o.isProd) {
    CONFIG.plugins.push(
      new WebpackPwaManifest({
        name: 'hello',
        short_name: 'hello',
        description: 'hello',
        background_color: '#fafafa',
        theme_color: '#b1624d',
        inject: true,
        includeDirectory: true,
        filename: 'program/pwa/manifest.json',
        ios: true,
        icons: [
          {
            src: path.resolve('src/asset/1.png'),
            sizes: [72, 96, 128, 144, 192, 384, 512],
            destination: path.join('program', 'pwa'),
          },
          {
            src: path.resolve('src/asset/1.png'),
            sizes: [120, 152, 167, 180],
            ios: true,
            destination: path.join('program', 'pwa'),
          },
        ],
        publicPath: '/',
      }),
    );
  }

  CONFIG.plugins.push(
    new webpack.HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20,
    }),
  );
  return CONFIG;
};
