/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const { createServer } = require('http');
const { graphiql, isTesting } = require('../config');
const typeDefs = require('../graphql/schema');
const resolvers = require('../graphql/resolvers');
const context = require('../graphql/context');
const validators = require('../middleware/validator');
const permissions = require('../middleware/shield');

const app = express();
if (!isTesting) {
  // eslint-disable-next-line global-require
  require('../helpers/cron');
}

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send({ up: 'workout or stay-out!!!' });
});

const schema = makeExecutableSchema({ typeDefs, resolvers });
const schemaWithMiddleware = applyMiddleware(schema, validators, permissions);
const apolloServer = new ApolloServer({
  schema: schemaWithMiddleware,
  context,
  subscriptions: {
    onConnect: () => {
      console.log(`Subscriptions successfully connected to ${apolloServer.subscriptionsPath}`);
    },
    onDisconnect: () => {
      console.log('Subscriptions successfully disconnected!');
    }
  },
  cacheControl: {
    defaultMaxAge: 0,
  },
  introspection: graphiql,
  playground: graphiql,
});

apolloServer.applyMiddleware({ app, path: '/api' });

const server = createServer(app);

apolloServer.installSubscriptionHandlers(server);

module.exports = server;
