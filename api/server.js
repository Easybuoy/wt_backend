const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authMiddleware = require('../middleware/authentication');
const graphQLHttp = require('../middleware/graphql');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use(authMiddleware);
server.use('/api', graphQLHttp);

server.get('/', (req, res) => {
  res.send({ up: `workout or stay-out!!!` })
});

module.exports = server;