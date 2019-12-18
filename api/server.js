const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const typeDefs = require('../graphql/schema');
const resolvers = require('../graphql/resolvers');
const permissions = require('../middleware/shield');
const User = require('../models/user');
const { jwtSecret, graphiql } = require('../config');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ up: 'workout or stay-out!!!' });
});

const schema = makeExecutableSchema({ typeDefs, resolvers });
const schemaWithMiddleware = applyMiddleware(schema, permissions);
const apolloServer = new ApolloServer({
  schema: schemaWithMiddleware,
  context: async (args) => {
    const { req, res } = args;
    // if an authorization token is sent
    // authentication token will be validated
    const token = req.headers.authorization;
    let user = null;
    if (token) {
      try {
        const decodedToken = jwt.verify(token, jwtSecret);
        if (decodedToken && decodedToken.id) {
          user = await User.findById(decodedToken.id);
          if (user && user.id) {
            user = { ...user._doc, _id: user.id };
          } else throw new Error('User does not exist!');
        } else throw new Error('Invalid token!');
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
