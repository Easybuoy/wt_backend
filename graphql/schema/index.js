const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    _id: ID!
    name: String
    email: String!
    password: String
    height: Float
    heightUnit: String
    weight: Float
    weightUnit: String
    goal: String
    equipment: String
    experience: String
    google: UserPlatform
    facebook: UserPlatform
    photo: String
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

  input UserUpdateInput {
    id: String!
    name: String
    password: String
    height: Float
    heightUnit: String
    weight: Float
    weightUnit: String
    goal: String
    equipment: String
    experience: String
    photo: String
  }

  type Query {
    authForm(input: UserFormLoginInput!): UserAuthResponse
  }

  type Mutation {
    addUser(input: UserSignupInput!): User
    authFacebook(input: UserPlatformAuthInput!): UserAuthResponse
    authGoogle(input: UserPlatformAuthInput!): UserAuthResponse
    updateUser(input: UserUpdateInput!): User
  }


`;
