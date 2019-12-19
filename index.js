/* eslint-disable no-console */
const { port } = require('./config');
const server = require('./api/server');
const connect = require('./api/database');

connect.then(() => {
  console.log('Successfully connected to the database!');
  server.listen(port, () => {
    console.log(`Successfully connected to localhost:${port}`);
  });
}).catch((err) => { throw err; });
