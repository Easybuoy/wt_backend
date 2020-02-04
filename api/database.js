/* eslint-disable no-console */
const mongoose = require('mongoose');
const {
  mongoConnect,
  mongoConnectTest,
  isTesting,
  isProduction
} = require('../config');

mongoose.set('debug', false);
module.exports = mongoose.connect(
  (isTesting ? mongoConnectTest : mongoConnect),
  {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
);
