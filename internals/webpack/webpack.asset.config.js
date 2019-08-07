function getAssetConfig() {
  let CONFIG = {};

  const svg = {
    test: /\.svg$/,
    use: [
      {
        loader: 'svg-url-loader',
        options: {
          limit: 10 * 1024,
          noquotes: true,
          name: 'asset/img/[name].[hash:7].[ext]',
        },
      },
    ],
  };
  const font = {
    test: /\.(eot|otf|ttf|woff|woff2)$/,
    use: {
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'asset/font/[name].[hash:7].[ext]',
      },
    },
  };
  const img = {
    test: /\.(jpg|png|gif)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10 * 1024,
          name: 'asset/img/[name].[hash:7].[ext]',
        },
      },
      {
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: {
            enabled: false,
          },
          gifsicle: {
            interlaced: false,
          },
          optipng: {
            optimizationLevel: 7,
          },
          pngquant: {
            quality: '65-90',
            speed: 4,
          },
        },
      },
    ],
  };

  const html = {
    test: /\.html$/,
    use: 'html-loader',
  };

  const media = {
    test: /\.(mp4|webm|mp3|avi|mkv)$/,
    use: {
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'asset/media/[name].[hash:7].[ext]',
      },
    },
  };

  CONFIG = {
    module: {
      rules: [svg, font, img, html, media],
    },
  };
  return CONFIG;
}

module.exports = getAssetConfig;
