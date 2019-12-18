const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('../graphql/schema');
const resolvers = require('../graphql/resolvers');
const authMiddleware = require('../middleware/authentication');
const { graphiql } = require('../config');


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

app.get('/', (req, res) => {
  res.send({ up: 'workout or stay-out!!!' });
});

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }), // adds request and response to graphQL context
  introspection: graphiql,
  playground: graphiql,
});

apolloServer.applyMiddleware({ app, path: '/api' });

module.exports = app;
