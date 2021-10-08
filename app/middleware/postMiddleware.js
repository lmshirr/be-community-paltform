const { Community_Member, Community_Post } = require('../models/index');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { ForbiddenException } = require('../utils/httpExceptions');

const checkUser_delete_patch = (req, res, next) => {
  const token = req.cookies.jwt;
  jwt.verify(token, process.env.SECRET_KEY, async (error, decodedToken) => {
    if (error) {
      return res.status(200).json({
        success: false,
        message: error,
      });
    }
    try {
      const post = await Community_Post.findOne({
        where: {
          id: req.params.postId,
        },
      });
      if (decodedToken.id !== post.user_id) {
        return res.status(200).json({
          success: false,
          message: 'You dont have permission to this action!',
        });
      }
      next();
    } catch (err) {
      if (err.name === 'SequelizeDatabaseError') {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  });
};

const checkMembership_post = async (req, res, next) => {
  const { id: user_id } = req.user;
  const { id: community_id } = req.params;

  const checkMember = await Community_Member.findOne({
    where: {
      [Op.and]: [{ user_id }, { community_id }],
    },
  });

  if (!checkMember) {
    return next(new ForbiddenException('You are not member on this community'));
  }
  next();
};

module.exports = { checkUser_delete_patch, checkMembership_post };
