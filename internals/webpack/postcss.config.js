const autoprefixer = require('autoprefixer');
const PostcssFlexbugsFixes = require('postcss-flexbugs-fixes');

const autoprefixerOptions = {
  browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 11'],
  flexbox: 'no-2009',
};
module.exports = {
  plugins: [PostcssFlexbugsFixes, autoprefixer(autoprefixerOptions)],
};
