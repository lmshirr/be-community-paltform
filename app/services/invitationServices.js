const { Invitation, Community_Member } = require('../models/index');
const { Op } = require('sequelize');
const {
  ConflictException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} = require('../utils/httpExceptions');

/**
 *
 * @param {string} community_id
 * @returns {Object} invitation
 */
const getInvitationCommunity = async (community_id) => {
  const invitation = await Invitation.findAll({
    where: {
      community_id,
    },
  });

  return invitation;
};

/**
 *
 * @param {string} user_id
 * @param {string} community_id
 * @param {string} inviterId
 * @returns invite
 */
const createInvitation = async (user_id, community_id, inviterId) => {
  // check is already member
  const isMember = await Community_Member.findOne({
    where: {
      [Op.and]: [{ user_id }, { community_id }],
    },
  });

  if (isMember) {
    throw new ConflictException('This User is already a member!');
  }

  // check is already invite
  const isAlreadyInvited = await Invitation.findOne({
    where: {
      [Op.and]: [{ user_id }, { community_id }, { inviter: inviterId }],
    },
  });

  if (isAlreadyInvited) {
    throw new BadRequestException(
      'You already invite this user, please wait for respond'
    );
  }

  const invite = await Invitation.create({
    inviter: inviterId,
    user_id,
    community_id,
  });

  return invite;
};

/**
 *
 * @param {string} id invitation id
 * @param {string} user_id
 * @param {string} respond
 * @returns {invite: Object, message: string}
 */
const respondInvite = async (id, user_id, respond) => {
  let invite = await Invitation.findOne({ where: { id } });

  if (!invite) {
    throw new NotFoundException('Invitation not found');
  }

  if (user_id === invite.inviter) {
    throw new ForbiddenException('You are not allowed to do this action');
  }

  let message;
  if (respond === 'approve') {
    const { user_id: userId, community_id } = invite;

    invite = await Community_Member.create({
      user_id: userId,
      community_id,
    });

    await Invitation.destroy({ where: { id } });

    message = 'You joined the community';
  } else if (respond === 'refuse') {
    invite = await invite.update({
      status: 'refused',
    });

    message = 'Invitation refused';
  }

  return { invite, message };
};

/**
 *
 * @param {string} id
 * @returns invitation
 */
const deleteInvitation = async (id) => {
  const invitation = await Invitation.destroy({ where: { id } });

  if (!invitation) {
    throw new NotFoundException('Invitation not found');
  }

  return invitation;
};

module.exports = {
  getInvitationCommunity,
  createInvitation,
  respondInvite,
  deleteInvitation,
};
