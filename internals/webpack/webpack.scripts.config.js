const webpack = require('webpack');

function getScriptsConfig(o) {
  const jsxRule = {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          configFile: './internals/webpack/babel.config.js',
          babelrc: false
        }
      }
    ]
  };

  const CONFIG = {
    module: {
      rules: [jsxRule]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.tsx', 'ts'],
      alias: {}
    },
    devServer: {
      historyApiFallback: true
    },
    plugins: []
  };

  if (o.hotReload) {
    CONFIG.plugins.push(new webpack.NamedModulesPlugin());
    CONFIG.resolve.alias['react-dom'] = '@hot-loader/react-dom';
    CONFIG.devServer.hot = true;
  }

  return CONFIG;
}

module.exports = getScriptsConfig;
