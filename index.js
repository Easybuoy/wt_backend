const config = require('./config');
const mongoose = require('mongoose');
const server = require('./api/server');

mongoose.connect(
  config.mongoConnect,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
).then(() => {
  console.log(`Successfully connected to the database!`)
  server.listen(config.port, (req, res, next) => {
    console.log(`Successfully connected to localhost:${config.port}`);
  });
}).catch((err) => {
  console.log(err);
});
