const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    _id: ID!
    name: String
    email: String!
    password: String
    google: UserPlatform
    facebook: UserPlatform
  }

  type UserPlatform {
    id: String
    token: String
  }
  
  input UserSignupInput {
    name: String
    email: String!
    password: String
  }
  
  type UserAuthResponse {
    id: String
    name: String
    token: String
  }

  input UserPlatformAuthInput {
    accessToken: String!
  }

  input UserFormLoginInput {
    email: String
    password: String
  }

  type Query {
    authForm(input: UserFormLoginInput!): UserAuthResponse
  }

  type Mutation {
    addUser(input: UserSignupInput!): User
    authFacebook(input: UserPlatformAuthInput!): UserAuthResponse
    authGoogle(input: UserPlatformAuthInput!): UserAuthResponse
  }
`;
