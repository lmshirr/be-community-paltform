const {
  Community,
  Community_Member,
  Request_Membership,
  User,
  Invitation,
} = require('../shared/db/models');
const { Op } = require('sequelize');
const {
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} = require('../shared/utils/httpExceptions');

/**
 *
 * @param {string} community_id
 * @param {string} user_id
 * @returns {member: Object, message: string}
 */
const joinCommunity = async (community_id, user_id) => {
  const community = await Community.findOne({ where: { id: community_id } });

  if (!community) {
    throw new NotFoundException('Community not found');
  }

  // check is already member ?
  const isMember = await Community_Member.findOne({
    where: {
      [Op.and]: [{ user_id }, { community_id }],
    },
  });

  if (isMember) {
    throw new ConflictException('You are already a member!');
  }

  let member;
  let message;

  if (community.privacy === 'public') {
    member = await Community_Member.create({
      user_id,
      community_id,
    });

    message = 'Join success';
  } else if (community.privacy === 'private') {
    // check is already request, if yes return please wait for confirmation from admin
    const isAlreadyRequest = await Request_Membership.findOne({
      where: { user_id, community_id },
    });

    if (isAlreadyRequest) {
      throw new ForbiddenException(
        'You already request to this community, please wait for confirmation'
      );
    }

    member = await Request_Membership.create({
      user_id,
      community_id,
    });

    message = 'Your request to join this community has been sent';
  }

  return { member, message };
};

/**
 *
 * @param {string} communityId
 * @param {string} userId userId that want to change role
 * @param {string} ownerUserId userId that do update role
 * @param {string} role
 * @returns {Object} newMemberRole
 */
const updateRole = async (community_id, user_id, ownerUserId, role) => {
  let newMemberRole = await Community_Member.findOne({
    where: {
      [Op.and]: [{ user_id }, { community_id }],
    },
  });

  if (!newMemberRole) {
    throw new NotFoundException(
      'User that you want to change role not a member in this community'
    );
  }

  if (role === 'owner') {
    newMemberRole = await newMemberRole.update({
      role: 'owner',
    });

    const owner = await Community_Member.findOne({
      where: { user_id: ownerUserId, community_id },
    });

    await owner.update({ role: 'member' });
  } else {
    newMemberRole = await newMemberRole.update({
      role,
    });
  }

  return newMemberRole;
};

/**
 *
 * @param {string} userId user id from check member middleware
 * @param {string} community_id community id from params
 * @param {string} role role from check member middleware
 * @returns {Object} member
 */
const leaveCommunity = async (user_id, community_id, role) => {
  if (role === 'owner') {
    throw new ForbiddenException(
      'You must move your ownership to other people first!'
    );
  }

  const member = await Community_Member.destroy({
    where: {
      [Op.and]: [{ user_id }, { community_id }],
    },
  });

  return member;
};

/**
 *
 * @param {string} community_id
 * @returns {Array} members
 */
const getCommunityMembers = async (community_id) => {
  const members = await Community.findOne({
    where: { id: community_id },
    include: {
      model: User,
      required: true,
      order: [[User, 'created_at', 'DESC']],
    },
  });

  return members;
};

// invitation
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

const getRequestCommunity = async (community_id) => {
  const request = await Request_Membership.findAll({
    where: {
      community_id,
    },
  });

  return request;
};

/**
 *
 * @param {string} id request id
 * @param {string} community_id
 * @param {string} respond
 * @returns {message: string, respondData: Object}
 */
const respondRequest = async (id, community_id, respond) => {
  const request = await Request_Membership.findOne({
    where: { id },
  });

  if (!request) {
    throw new NotFoundException('Request not found');
  }

  let message;
  let respondData;

  if (respond === 'refuse') {
    respondData = await request.update({
      status: 'refused',
    });

    message = 'Request refused';
  } else if (respond === 'approve') {
    const { user_id } = request;

    respondData = await Community_Member.create({
      user_id,
      community_id,
    });

    await Request_Membership.destroy({ where: { id } });

    message = 'Request approved';
  }

  return { respondData, message };
};

module.exports = {
  joinCommunity,
  updateRole,
  leaveCommunity,
  getCommunityMembers,
  getInvitationCommunity,
  createInvitation,
  respondInvite,
  deleteInvitation,
  getRequestCommunity,
  respondRequest,
};
