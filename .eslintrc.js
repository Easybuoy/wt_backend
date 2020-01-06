module.exports = {
  extends: 'airbnb-base',
  plugins: ['jest'],
  rules: {
    'func-names': 'off',
    'no-unused-vars': 'warn',
    'linebreak-style': 'off',
    'comma-dangle': 'off',
    'no-useless-catch': 'off',
    'no-underscore-dangle': 'off'
  },
  globals: {
    jest: true,
  },
  env: {
    'jest/globals': true,
  },
};
