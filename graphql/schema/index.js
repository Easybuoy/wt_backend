const { buildSchema } = require('graphql');

module.exports = buildSchema(`

  type User {
    _id: ID!
    email: String!
    password: String
  }

  input UserInput {
    email: String!
    password: String!
  }

  type UserLoginData {
    id: String!
    token: String!
  }

  type RootQuery {
    login(email: String!, password: String!): UserLoginData!
  }

  type RootMutation {
    createUser(input: UserInput): User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);