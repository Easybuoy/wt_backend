const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const typeDefs = require('../graphql/schema');
const resolvers = require('../graphql/resolvers');
const context = require('../graphql/context');
const validators = require('../middleware/validator');
const permissions = require('../middleware/shield');
const multer = require('../middleware/multer');
const { graphiql } = require('../config');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ up: 'workout or stay-out!!!' });
});

const schema = makeExecutableSchema({ typeDefs, resolvers });
const schemaWithMiddleware = applyMiddleware(schema, validators, permissions, multer.array('image'));
const apolloServer = new ApolloServer({
  schema: schemaWithMiddleware,
  context,
  introspection: graphiql,
  playground: graphiql,
});

apolloServer.applyMiddleware({ app, path: '/api' });

module.exports = app;
