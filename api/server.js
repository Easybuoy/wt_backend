const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const graphQLHttp = require('express-graphql');

const graphQLSchema = require('../graphql/schema/index');
const graphQLResolvers = require('../graphql/resolvers/index');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api', graphQLHttp({
  schema: graphQLSchema,
  rootValue: graphQLResolvers,
  graphiql: true
}));

server.get('/', (req, res) => {
  res.send({ up: `workout or stay-out!!!` })
});

module.exports = server;