const { Op } = require('sequelize');
const { Community_Member, Community_Post } = require('../shared/db/models');
const {
  ForbiddenException,
  NotFoundException,
} = require('../shared/utils/httpExceptions');

const checkAdmin = async (req, res, next) => {
  const { id: user_id } = req.user;
  const { communityId: community_id } = req.params;

  try {
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
      throw new ForbiddenException('You dont have permission to this action!');
    }

    req.member = admin.dataValues;
  } catch (error) {
    return next(error);
  }

  next();
};

const checkOwner = async (req, res, next) => {
  const { id: user_id } = req.user;
  const { communityId: community_id } = req.params;

  try {
    const owner = await Community_Member.findOne({
      where: {
        [Op.and]: [{ user_id }, { community_id }, { role: 'owner' }],
      },
    });

    if (!owner) {
      throw new ForbiddenException('You dont have permission to this action!');
    }

    req.member = owner.dataValues;
  } catch (error) {
    return next(error);
  }

  next();
};

const checkMember = async (req, res, next) => {
  const { id: user_id } = req.user;
  const { communityId: community_id } = req.params;

  try {
    const member = await Community_Member.findOne({
      where: {
        [Op.and]: [{ user_id }, { community_id }],
      },
    });

    if (!member) {
      throw new ForbiddenException('You are not member on this community');
    }

    req.member = member.dataValues;
  } catch (error) {
    return next(error);
  }

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
      throw new NotFoundException('Post not found');
    }

    if (user_id !== postOwner.user_id) {
      throw new ForbiddenException('You are not allowed to do this action');
    }
  } catch (error) {
    return next(error);
  }

  next();
};

module.exports = { checkAdmin, checkMember, checkOwner, checkPostOwner };
