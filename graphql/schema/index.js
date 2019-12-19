const { gql } = require('apollo-server-express');
const authSchema = require('./auth.graphql');
const unitSchema = require('./unit.graphql');

const rootSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  ${authSchema}
  ${unitSchema}
`;

module.exports = rootSchema;
