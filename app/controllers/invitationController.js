const { Invitation, Community_Member } = require('../models/index');
const { Op } = require('sequelize');
const {
  InternalServerException,
  ConflictException,
  BadRequestException,
} = require('../utils/httpExceptions');

module.exports.getInvitationUser = async function (req, res, next) {
  const { id: user_id } = req.user;

  let invitation;
  try {
    invitation = await Invitation.findAll({
      where: {
        user_id,
      },
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({
    data: invitation,
  });
};

module.exports.getInvitationCommunity = async function (req, res, next) {
  const { community_id } = req.query;

  let invitation;
  try {
    invitation = await Invitation.findAll({
      where: {
        community_id,
      },
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  return res.status(200).json({
    data: invitation,
  });
};

module.exports.createInvitation = async function (req, res, next) {
  const { community_id, user_id } = req.query;
  const { id } = req.user;

  let invite;
  try {
    const isMember = await Community_Member.findOne({
      where: {
        [Op.and]: [{ user_id }, { community_id }],
      },
    });

    if (isMember) {
      return next(new ConflictException('This User is already a member!'));
    }

    invite = await Invitation.create({
      inviter: id,
      user_id,
      community_id,
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  return res.status(200).json({
    messages: 'User invited',
    data: invite,
  });
};

module.exports.respondInvite = async function (req, res, next) {
  const { respond } = req.query;
  const { id } = req.params;

  try {
    if (!respond) {
      return BadRequestException('Please input the respond');
    }

    const invite = await Invitation.findOne({ where: { id } });

    if (respond === 'approve') {
      const { user_id, community_id } = invite;

      await Community_Member.create({
        user_id,
        community_id,
      });

      await Invitation.destroy({ where: { id } });

      return res.status(200).json({
        messages: 'Community Joined',
      });
    }

    if (respond === 'refuse') {
      invite.update({
        status: 'refused',
      });

      return res.status(200).json({
        messages: 'Invitation refused',
      });
    }
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }
};

module.exports.deleteInvite = async function (req, res, next) {
  const { id } = req.params;

  try {
    await Invitation.destroy({ where: { id } });

    return res.status(200).json({
      success: true,
      messages: 'Delete success!',
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }
};
