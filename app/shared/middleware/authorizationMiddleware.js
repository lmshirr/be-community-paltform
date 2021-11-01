require('dotenv').config({ path: '../.env' });
const jwt = require('jsonwebtoken');
const { UnauthorizedException } = require('../../utils/httpExceptions');

const checkLogin = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedException("You aren't logged in"));
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(new UnauthorizedException("You aren't logged in"));
    }

    req.user = decoded;
  });

  next();
};

module.exports = { checkLogin };
