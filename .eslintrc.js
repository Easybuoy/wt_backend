module.exports = {
  extends: 'airbnb-base',
  plugins: ['jest'],
  rules: {
    'no-unused-vars': 'warn',
  },
  globals: {
    jest: true,
  },
  env: {
    'jest/globals': true,
  },
};
