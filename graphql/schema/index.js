const { gql } = require('apollo-server-express');
const authSchema = require('./auth.graphql');
const unitSchema = require('./unit.graphql');
const exerciseSchema = require('./exercise.graphql');
const workoutSchema = require('./workout.graphql');
const scheduleSchema = require('./schedule.graphql');

const rootSchema = gql`
  scalar Upload
  
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }

  input Filter {
    search: String!
    fields: [String!]!
  }

  ${authSchema}
  ${unitSchema}
  ${exerciseSchema}
  ${workoutSchema}
  ${scheduleSchema}

`;

module.exports = rootSchema;
