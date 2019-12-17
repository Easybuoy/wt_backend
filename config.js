require('dotenv').config();
const {
  PORT,
  MONGO_CLUSTER,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_DB,
  NODE_ENV
} = process.env;

module.exports = {
  env: NODE_ENV ? NODE_ENV : 'development',
  port: PORT,
  mongoCluster: MONGO_CLUSTER,
  mongoUser: MONGO_USER,
  mongoPassword: MONGO_PASSWORD,
  mongoDatabase: MONGO_DB,
}