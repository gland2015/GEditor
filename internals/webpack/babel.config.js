module.exports = function(api) {
  const {hotReload = true} = process.myPackSetting;
  api.cache.forever();

  const presets = [
    // 预设就是包含一组其他插件或预设
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '72'
        },
        modules: false
      }
    ],
    ['@babel/preset-react']
  ];

  const plugins = [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import'
  ];

  if (hotReload) {
    plugins.push('react-hot-loader/babel');
  }

  return {
    presets,
    plugins
  };
};
