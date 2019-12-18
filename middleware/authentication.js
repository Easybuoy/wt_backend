const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
  const token = req.authorization;
  if (!token) {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.jwtSecret);
    req.isAuth = true;
    req.userId = decodedToken.id;
    return next();
  } catch (err) {
    req.isAuth = false;
    return next();
  }
};
