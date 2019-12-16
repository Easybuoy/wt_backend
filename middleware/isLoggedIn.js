const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.authorization;
  req.isAuth = false;
  if (!req.authorization) {
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretkey', (decodedToken) => {});
  } catch (err) {
    return next();
  }
  if (!decodedToken) {
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};