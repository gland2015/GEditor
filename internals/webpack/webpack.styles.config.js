const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function getStylesConfig(o) {
  let CONFIG = {};
  const {
    stylesSourceMap: sourceMap = true,
    cssModule = true,
    usePostcss = true,
    extractCss = false,
  } = o;
  const styleLoader = extractCss
    ? {
        loader: MiniCssExtractPlugin.loader,
        options: {},
      }
    : 'style-loader';
  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap,
      camelCase: true,
      importLoaders: usePostcss ? 2 : 1,
      modules: !!cssModule,
      localIdentName: cssModule ? '[name]_[local]_[hash:base64:8]' : undefined,
    },
  };

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap,
      ident: 'postcss',
      config: {
        path: './internals/webpack',
      },
    },
  };

  const basicLoader = usePostcss
    ? [styleLoader, cssLoader, postcssLoader]
    : [styleLoader, cssLoader];

  const npmScssCss = {
    test: /\.s?css$/,
    include: [/node_modules/],
    use: [...basicLoader, {loader: 'sass-loader', options: {sourceMap}}],
  };

  const myScssCss = {
    test: /\.s?css$/,
    exclude: [/node_modules/],
    use: [
      ...basicLoader,
      {
        loader: 'sass-loader',
        options: {
          sourceMap,
          includePaths: [path.join(process.cwd(), 'src/styles')],
        },
      },
    ],
  };

  const postcss = {
    test: /\.(postcss|sss)$/,
    exclude: [/node_modules/],
    use: [
      styleLoader,
      {
        loader: 'css-loader',
        options: {
          sourceMap,
          camelCase: true,
          importLoaders: 1,
          modules: !!cssModule,
          localIdentName: cssModule ? '[name]_[local]_[hash:base64:8]' : undefined,
        },
      },
      postcssLoader,
    ],
  };

  const less = {
    test: /\.less$/,
    exclude: [/node_modules/],
    use: [
      ...basicLoader,
      {
        loader: 'less-loader',
        options: {
          sourceMap,
        },
      },
    ],
  };

  const stylus = {
    test: /\.styl(us)?$/,
    exclude: [/node_modules/],
    use: [
      ...basicLoader,
      {
        loader: 'stylus-loader',
        options: {
          sourceMap,
        },
      },
    ],
  };

  CONFIG = {
    module: {
      rules: [npmScssCss, myScssCss, less, stylus, postcss],
    },
    plugins: [],
  };

  if (extractCss) {
    CONFIG.plugins.push(
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[id].css',
      }),
    );
  }
  return CONFIG;
}

module.exports = getStylesConfig;
