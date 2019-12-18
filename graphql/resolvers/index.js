const authResolver = require('./auth');

const rootResolver = {
  Query: {
    ...authResolver.Query
  },
  Mutation: {
    ...authResolver.Mutation
  }
};

module.exports = rootResolver;
