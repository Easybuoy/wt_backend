const authResolver = require('./authResolver');

const rootResolver = {
  ...authResolver,
};

module.exports = rootResolver;
