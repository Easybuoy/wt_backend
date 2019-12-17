const { buildSchema } = require('graphql');

module.exports = buildSchema(`

  type User {
    _id: ID!
    email: String!
    password: String
    type: String
    googleId: String
    facebookId: String
  }

  input CreateUserInput {
    type: String!
    email: String
    password: String
    googleId: String
    facebookId: String
  }

  input LoginInput {
    type: String
    email: String
    password: String
    googleId: String
    facebookId: String
  }

  type UserLoginData {
    id: String!
    token: String!
  }

  type RootQuery {
    login(input: LoginInput): UserLoginData!
  }

  type RootMutation {
    createUser(input: CreateUserInput): User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);