const { gql } = require('apollo-server-express');
const authSchema = require('./auth.graphql');
const unitSchema = require('./unit.graphql');
const workoutSchema = require('./workout.graphql');

const rootSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  ${authSchema}
  ${unitSchema}
  ${workoutSchema}
`;

module.exports = rootSchema;
