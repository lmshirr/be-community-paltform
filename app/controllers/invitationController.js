const { Invitation, Community_Member } = require('../models/index');
const { Op } = require('sequelize');
const {
  InternalServerException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} = require('../utils/httpExceptions');

module.exports.getInvitationCommunity = async function (req, res, next) {
  const { id: community_id } = req.params;

  let invitation;
  try {
    invitation = await Invitation.findAll({
      where: {
        community_id,
      },
    });
  } catch (error) {
    console.log(error);
    return next(new InternalServerException('Internal server error', error));
  }

  return res.status(200).json({
    data: invitation,
  });
};

module.exports.createInvitation = async function (req, res, next) {
  const { id: community_id } = req.params;
  const { user_id } = req.body;
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

    // check is already invite
    const isAlreadyInvited = await Invitation.findOne({
      where: { [Op.and]: [{ user_id }, { community_id }, { inviter: id }] },
    });
    if (isAlreadyInvited) {
      return next(
        new ForbiddenException(
          'You already invite this user, please wait for respond'
        )
      );
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
  const { respond } = req.body;
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
  const { id: community_id, invitationId } = req.params;

  try {
    await Invitation.destroy({ where: { id: invitationId } });

    return res.status(200).json({
      success: true,
      messages: 'Delete success!',
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }
};
