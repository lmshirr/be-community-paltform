const {
  Community,
  Community_Member,
  Request_Membership,
  User,
} = require('../models/index');
const { Op } = require('sequelize');
const {
  NotFoundException,
  ConflictException,
  ForbiddenException,
} = require('../utils/httpExceptions');

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

  if (community.privacy === 'open') {
    member = await Community_Member.create({
      user_id,
      community_id,
    });

    message = 'Join success';
  } else if (community.privacy === 'closed') {
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

module.exports = {
  joinCommunity,
  updateRole,
  leaveCommunity,
  getCommunityMembers,
};
