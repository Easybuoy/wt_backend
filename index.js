/* eslint-disable no-console */
const mongoose = require('mongoose');
const { mongoConnect, port, isProduction } = require('./config');
const server = require('./api/server');

mongoose.connect(
  mongoConnect,
  {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    debug: isProduction,
  },
).then(() => {
  console.log('Successfully connected to the database!');
  server.listen(port, () => {
    console.log(`Successfully connected to localhost:${port}`);
  });
}).catch((err) => {
  console.log(err);
});
