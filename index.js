require('dotenv').config();
const mongoose = require('mongoose');
const server = require('./api/server');

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => {
  console.log(`Successfully connected to the database!`)
  server.listen(process.env.PORT, (req, res, next) => {
    console.log(`Successfully connected to localhost:${process.env.PORT}`);
  });
}).catch(err => {
  console.log(err);
});