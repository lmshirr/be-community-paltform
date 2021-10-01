const { Community_Member, Community_Post } = require('../models');
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

const checkOwnPost = async (req, res, next) => {
  const { id: user_id } = req.user;
  const { id: community_id, postId: post_id } = req.params;
  console.log('-----------------------------------------------------')

  try {
    const isOwnPost = await Community_Post.findOne({
      where: { [Op.and]: [{ id: post_id }, { community_id }, { user_id }] },
    });

    if (!isOwnPost) {
      return next(
        new ForbiddenException('You are not allowed to do this action!')
      );
    }
  } catch (error) {
    return next(new InternalServerException());
  }

  next();
};

module.exports = { checkMembership, checkOwnPost };
