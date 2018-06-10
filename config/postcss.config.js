const path = require('path');

const base = path.resolve(__dirname, '../');

module.exports = {
  plugins: {
    'postcss-import': {
      root: base,
      path: [
        'src',
      ],
    },
    'postcss-mixins': {},
    'postcss-each': {},
    'postcss-apply': {},
    'postcss-nesting': {},
    'postcss-preset-env': {
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9', // React doesn't support IE8 anyway
      ],
    },
    'postcss-flexbugs-fixes': {},
    'postcss-reporter': { clearMessages: true },
  },
};
