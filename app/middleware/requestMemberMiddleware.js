const db = require('../models/index');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const checkAdmin = (req, res, next) => {
  const token = req.cookies.jwt;
  jwt.verify(token, process.env.SECRET_KEY, async (error, decodedToken) => {
    if (error) {
      return res.status(200).json({
        success: false,
        message: error,
      });
    }
    const role = await db.Community_Member.findOne({
      where: {
        [Op.and]: [
          { UserId: decodedToken.UserId },
          { CommunityId: req.params.CommunityId },
          { [Op.or]: [{ role: 'Owner' }, { role: 'Administrator' }] },
        ],
      },
    });
    if (!role) {
      return res.status(200).json({
        success: false,
        messages: 'You dont have permission to this action!',
      });
    }
    next();
  });
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  jwt.verify(token, process.env.SECRET_KEY, async (error, decodedToken) => {
    if (error) {
      return res.status(200).json({
        success: false,
        message: error,
      });
    }
    const request = await db.Request_Membership.findByPk(req.params.id);
    if (decodedToken.UserId == request.UserId) {
      next();
    }
    return res.status(200).json({
      success: false,
      messages: 'You dont have permission to this action!',
    });
  });
};

module.exports = { checkAdmin, checkUser };
