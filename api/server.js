/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const connect = require('./database');
const { graphiql, port } = require('../config');
const typeDefs = require('../graphql/schema');
const resolvers = require('../graphql/resolvers');
const context = require('../graphql/context');
const validators = require('../middleware/validator');
const permissions = require('../middleware/shield');

const app = express();
require('../helpers/cron');

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ up: 'workout or stay-out!!!' });
});

const schema = makeExecutableSchema({ typeDefs, resolvers });
const schemaWithMiddleware = applyMiddleware(schema, validators, permissions);
const apolloServer = new ApolloServer({
  schema: schemaWithMiddleware,
  context,
  subscriptions: {
    path: '/api/subscriptions',
    onConnect: (connectionParams, webSocket) => {
      console.log('SUBS');
    }
  },
  cacheControl: {
    defaultMaxAge: 0,
  },
  introspection: graphiql,
  playground: graphiql,
});

apolloServer.applyMiddleware({ app, path: '/api' });

connect.then(() => {
  console.log('Database successfully connected!');
  app.listen(port, () => {
    console.log(`ApolloServer successfully connected to http://localhost:${port}${apolloServer.graphqlPath}`);
    console.log(`Subscriptions successfully connected to http://localhost:${port}${apolloServer.subscriptionsPath}`);
  });
}).catch((err) => { throw err; });

module.exports = app;
