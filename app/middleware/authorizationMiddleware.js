require('dotenv').config({ path: '../.env' });
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { Community_Member } = require('../models');
const {
  UnauthorizedException,
  ForbiddenException,
} = require('../utils/httpExceptions');

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

const checkAdmin = async (req, res, next) => {
  const { id: user_id } = req.user;
  const { id: community_id } = req.params;

  const role = await Community_Member.findOne({
    where: {
      [Op.and]: [
        { user_id },
        { community_id },
        { [Op.or]: [{ role: 'owner' }, { role: 'administrator' }] },
      ],
    },
  });

  if (!role) {
    return next(
      new ForbiddenException('You dont have permission to this action!')
    );
  }
  next();
};

const checkOwner = async (req, res, next) => {
  const { id: user_id } = req.user;
  const { id: community_id } = req.params;

  const role = await Community_Member.findOne({
    where: {
      [Op.and]: [{ user_id }, { community_id }, { role: 'owner' }],
    },
  });
  if (!role) {
    return next(
      new ForbiddenException('You dont have permission to this action!')
    );
  }

  next();
};

module.exports = { checkLogin, checkAdmin, checkOwner };
