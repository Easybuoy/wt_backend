const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const bodyParser = require('body-parser');
const graphQLHttp = require('express-graphql');

const graphQLSchema = require('../graphql/schema/index');
const graphQLResolvers = require('../graphql/resolvers/index');
const isLoggedIn = require('../middleware/isLoggedIn');

const server = express();

server.use(helmet());
server.use(cors());
server.use(bodyParser.json());

server.use(isLoggedIn);

server.use('/api', graphQLHttp({
  schema: graphQLSchema,
  rootValue: graphQLResolvers,
  graphiql: true
}));

module.exports = server;