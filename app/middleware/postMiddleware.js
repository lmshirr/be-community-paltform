const db = require('../models/index');
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
    const post = await db.Community_Post.findByPk(req.params.id);
    if (decodedToken.UserId !== post.UserId) {
      return res.status(200).json({
        success: false,
        message: 'You dont have permission to this action!',
      });
    }
    next();
  });
};

const checkMembership_post = async (req, res, next) => {
  const { id: user_id } = req.user;
  const { community_id } = req.body;

  const checkMember = await db.Community_Member.findOne({
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
