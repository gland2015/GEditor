module.exports = function(isProd) {
  const commom = {
    isProd,
    cssModule: true,
    usePostcss: true
  };

  const prod = {
    ...commom,
    stylesSourceMap: false, // 生成css的sourcemap
    extractCss: true, // 分离css
    splitChunks: true, // 代码分块
    hotReload: true, // 热重载，少量代码，无碍

    compressHtml: false, // 压缩HTML文件
    compress: true, // 输出压缩文件
    buildStats: true, // 输出构建状况
    pwa: true, // 是否开启pwa应用
    serviceWorker: true // 是否开启离线应用
  };

  const dev = {
    // 一般无需修改
    ...commom,
    stylesSourceMap: true,
    extractCss: false,
    splitChunks: false,
    hotReload: true
  };
  return (process.myPackSetting = isProd ? prod : dev);
};
