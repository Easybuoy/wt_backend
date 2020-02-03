/* eslint-disable no-console */
const server = require('./api/server');
const connect = require('./api/database');
const { port } = require('./config');

connect.then(() => {
  console.log('Database successfully connected!');
  server.listen(port, () => {
    console.log(`ApolloServer successfully connected to http://localhost:${port}/api`);
  });
}).catch((err) => { throw err; });
