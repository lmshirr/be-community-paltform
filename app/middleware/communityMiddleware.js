const { Op } = require('sequelize');
const { Community_Member, Community_Post } = require('../models');
const {
  ForbiddenException,
  NotFoundException,
  InternalServerException,
} = require('../utils/httpExceptions');

const checkAdmin = async (req, res, next) => {
  const { id: user_id } = req.user;
  const { id: community_id } = req.params;

  const admin = await Community_Member.findOne({
    where: {
      [Op.and]: [
        { user_id },
        { community_id },
        { [Op.or]: [{ role: 'owner' }, { role: 'administrator' }] },
      ],
    },
  });

  if (!admin) {
    return next(
      new ForbiddenException('You dont have permission to this action!')
    );
  }
  next();
};

const checkOwner = async (req, res, next) => {
  const { id: user_id } = req.user;
  const { id: community_id } = req.params;

  const owner = await Community_Member.findOne({
    where: {
      [Op.and]: [{ user_id }, { community_id }, { role: 'owner' }],
    },
  });

  if (!owner) {
    return next(
      new ForbiddenException('You dont have permission to this action!')
    );
  }

  next();
};

const checkMember = async (req, res, next) => {
  const { id: user_id } = req.user;
  const { id: community_id } = req.params;

  const member = await Community_Member.findOne({
    where: {
      [Op.and]: [{ user_id }, { community_id }],
    },
  });

  if (!member) {
    return next(new ForbiddenException('You are not member on this community'));
  }

  req.member = member.dataValues;

  next();
};

const checkPostOwner = async (req, res, next) => {
  const { postId: id } = req.params;
  const { id: user_id } = req.user;

  try {
    const postOwner = await Community_Post.findOne({
      where: { id },
    });

    if (!postOwner) {
      return next(new NotFoundException('Post not found'));
    }

    if (user_id !== postOwner.user_id) {
      return next(
        new ForbiddenException('You are not allowed to do this action')
      );
    }
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  next();
};

module.exports = { checkAdmin, checkMember, checkOwner, checkPostOwner };
