const {
  port,
  mongoUser,
  mongoPassword,
  mongoCluster,
  mongoDatabase
} = require('./config');
const mongoose = require('mongoose');
const server = require('./api/server');

mongoose.connect(
  `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoCluster}/${mongoDatabase}?retryWrites=true`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => {
  console.log(`Successfully connected to the database!`)
  server.listen(port, (req, res, next) => {
    console.log(`Successfully connected to localhost:${port}`);
  });
}).catch(err => {
  console.log(err);
});