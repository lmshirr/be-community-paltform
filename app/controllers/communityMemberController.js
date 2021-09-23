const {
  Community,
  Community_Member,
  Request_Membership,
} = require('../models/index');
const {
  ConflictException,
  InternalServerException,
  ForbiddenException,
  NotFoundException,
} = require('../utils/httpExceptions');
const { Op } = require('sequelize');

module.exports.joinCommunity = async function (req, res, next) {
  const { id: user_id } = req.user;
  const { id: community_id } = req.params;

  try {
    const community = await Community.findOne({ where: { id: community_id } });
    if (!community) {
      return next(new NotFoundException('Community not found'));
    }

    // check is already member ?
    const member = await Community_Member.findOne({
      where: {
        [Op.and]: [{ user_id }, { community_id }],
      },
    });

    if (member) {
      return next(new ConflictException('You are already a member!'));
    }

    if (community.privacy === 'open') {
      const data = await Community_Member.create({
        user_id,
        community_id,
      });

      return res.json({
        messages: 'Join success!',
        data,
      });
    }

    if (community.privacy === 'closed') {
      // check is already request, if yes return please wait for confirmation from admin
      const isAlreadyRequest = await Request_Membership.findOne({
        where: { user_id, community_id },
      });

      if (isAlreadyRequest) {
        return next(
          new ForbiddenException(
            'You already request to this community, please wait for confirmation'
          )
        );
      }

      const data = await Request_Membership.create({
        user_id,
        community_id,
      });

      return res.json({
        messages: 'Your request to join this community has been sent',
        data,
      });
    }
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }
};

module.exports.updateRole = async function (req, res, next) {
  const { id: community_id, memberId: user_id } = req.params;
  const { role } = req.body;
  const { id } = req.user;

  let newMemberRole;
  try {
    newMemberRole = await Community_Member.findOne({
      where: {
        [Op.and]: [{ user_id }, { community_id }],
      },
    });

    if (!newMemberRole) {
      return next(
        new NotFoundException('User want to change not exist in this community')
      );
    }

    if (role === 'owner') {
      // check is want to change have role owner ?
      const ownerCommunity = await Community_Member.findOne({
        where: {
          [Op.and]: [{ user_id: id }, { community_id }, { role: 'owner' }],
        },
      });

      if (!ownerCommunity) {
        return next(
          new NotFoundException(
            "You are not owner on this community, can't change role owner"
          )
        );
      }

      newMemberRole = await newMemberRole.update({
        role: 'owner',
      });
      await ownerCommunity.update({
        role: 'member',
      });

      return res.json({
        message: 'Change new owner success',
        data: newMemberRole,
      });
    }

    const memberWantToChangeRole = await Community_Member.findOne({
      where: {
        user_id: id,
      },
    });

    if (memberWantToChangeRole.role === 'member') {
      return next(
        new ForbiddenException(
          "You don't have authorization to change this member"
        )
      );
    }

    newMemberRole = await newMemberRole.update({
      role,
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({
    messages: 'Role updated!',
    data: newMemberRole,
  });
};

module.exports.leaveCommunity = async function (req, res, next) {
  const { id: community_id, memberId: user_id } = req.params;

  let member;
  try {
    member = await Community_Member.findOne({
      where: {
        [Op.and]: [{ user_id }, { community_id }],
      },
    });

    if (member.role === 'owner') {
      return next(
        new ForbiddenException(
          'You must move your ownership to other people first!'
        )
      );
    }

    member = await Community_Member.destroy({
      where: {
        [Op.and]: [{ user_id }, { community_id }],
      },
    });
  } catch (error) {
    console.log(error);
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({
    messages: 'You leave the group',
    data: member,
  });
};
