const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('../graphql/schema');
const resolvers = require('../graphql/resolvers');
// const authMiddleware = require('../middleware/authentication');
const User = require('../models/user');
const { jwtSecret, graphiql } = require('../config');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ up: 'workout or stay-out!!!' });
});

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    // if an authorization token is sent
    // authentication token will be validated
    const token = req.headers.authorization;
    let user;
    if (token) {
      try {
        const decodedToken = jwt.verify(token, jwtSecret);
        user = await User.findById(decodedToken.id);
        if (user) {
          user = { ...user._doc, _id: user.id };
        } else {
          throw new Error('Forbidden access!');
        }
      } catch (err) {
        throw err;
      }
    }
    return { req, res, user };
  },
  introspection: graphiql,
  playground: graphiql,
});

apolloServer.applyMiddleware({ app, path: '/api' });

module.exports = app;
