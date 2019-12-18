const authResolver = require('./authResolver');

const rootResolver = {
  Query: {
    ...authResolver.Query
  },
  Mutation: {
    ...authResolver.Mutation
  }
};

module.exports = rootResolver;
