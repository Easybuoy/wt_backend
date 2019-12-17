const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const typeDefs = require('../graphql/schema');
const resolvers = require('../graphql/resolvers');

const { ApolloServer } = require('apollo-server-express');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ up: `workout or stay-out!!!` })
});

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,  
  context: ({ req, res }) => ({ req, res }), // adds request and response to graphQL context
});

apolloServer.applyMiddleware({ app, path: '/api' });

module.exports = app;