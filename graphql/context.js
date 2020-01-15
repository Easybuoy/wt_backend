const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const User = require('../models/user');

module.exports = async (args) => {
  const { req, res, connection } = args;
  if (connection) return connection.context;
  // if an authorization token is sent
  // authentication token will be validated
  const token = req.headers.authorization;
  let user = null;
  if (token) {
    try {
      const decodedToken = jwt.verify(token, jwtSecret);
      if (decodedToken && decodedToken.id) {
        user = await User.findById(decodedToken.id);
        if (user && user.id) {
          user = { ...user._doc, id: user.id };
        } else throw new Error('User does not exist!');
      } else throw new Error('Invalid token!');
    } catch (err) {
      throw err;
    }
  }
  return { req, res, user };
};
