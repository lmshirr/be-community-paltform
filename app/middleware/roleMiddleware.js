const { Community_Member } = require('../models/index');
const { ForbiddenException } = require('../utils/httpExceptions');
const { Op } = require('sequelize');

const checkMembership = async (req, res, next) => {
  const { id } = req.user;
  const { community_id } = req.query;

  const role = await Community_Member.findOne({
    where: {
      [Op.and]: [{ user_id: id }, { community_id }],
    },
  });
  if (!role) {
    return next(new ForbiddenException('You are not member on this community'));
  }

  next();
};

module.exports = { checkMembership };
