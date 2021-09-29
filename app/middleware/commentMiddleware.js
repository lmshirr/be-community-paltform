const { Community_Member } = require('../models');
const { Op } = require('sequelize');
const {
  InternalServerException,
  ForbiddenException,
  BadRequestException,
} = require('../utils/httpExceptions');

const checkMembership = async (req, res, next) => {
  const { id: user_id } = req.user;
  const { id: community_id } = req.params;

  if (!community_id) {
    return next(
      new BadRequestException('Query parameter community_id must not empty')
    );
  }

  try {
    const member = await Community_Member.findOne({
      where: { [Op.and]: [{ user_id }, { community_id }] },
    });

    if (!member) {
      return next(
        new ForbiddenException('You are not member on this community')
      );
    }
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  next();
};

module.exports = { checkMembership };
