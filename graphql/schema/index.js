const { gql } = require('apollo-server-express');
const authSchema = require('./auth.graphql');
const unitSchema = require('./unit.graphql');
const exerciseSchema = require('./exercise.graphql');
const workoutSchema = require('./workout.graphql');
const scheduleSchema = require('./schedule.graphql');
const dashboardSchema = require('./dashboard.graphql');
const friendSchema = require('./friend.graphql');

const rootSchema = gql`
  scalar Upload

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }

  input Filter {
    search: String!
    fields: [String!]!
  }

  type Notification {
    userId: String
    message: String
    "A informative field describing relevant content and its ID"
    topic: String
  }

  input NotificationInput {
    userId: String
    message: String
    topic: String
    subscription: String
  }

  ${authSchema}
  ${unitSchema}
  ${exerciseSchema}
  ${workoutSchema}
  ${scheduleSchema}
  ${dashboardSchema}
  ${friendSchema}
`;

module.exports = rootSchema;
