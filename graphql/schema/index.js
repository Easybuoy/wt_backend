const { gql } = require('apollo-server-express');
const authSchema = require('./authSchema.graphql');

const rootSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  ${authSchema}
`;

module.exports = rootSchema;
