const { Community_Member } = require('../models/index');
const { ForbiddenException } = require('../utils/httpExceptions');
const { Op } = require('sequelize');
const { Invitation } = require('../models/index');

const checkMembership = async (req, res, next) => {
  const { id } = req.user;
  const { community_id } = req.params;

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

const invitationRestrictToMe = async (req, res, next) => {
  const { id } = req.user;
  const { invitationId } = req.params;

  const invitation = await Invitation.findOne({ where: { id: invitationId } });

  if (id !== invitation.user_id) {
    return next(
      new ForbiddenException('You are not allowed to do this action')
    );
  }

  next();
};

module.exports = { checkMembership, invitationRestrictToMe };
