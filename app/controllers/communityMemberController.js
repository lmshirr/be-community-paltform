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
  const { community_id } = req.query;

  try {
    const community = await Community.findOne({ where: { id: community_id } });

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
    console.log(error);
    return next(new InternalServerException('Internal server error', error));
  }
};

module.exports.updateRole = async function (req, res, next) {
  const { user_id, role, community_id } = req.query;
  const { id } = req.user;

  let member;
  try {
    // owner can't change to member or administrator
    if (role === 'owner') {
      return next(new ForbiddenException("You can't change ownership"));
    }

    member = await Community_Member.findOne({
      where: {
        [Op.and]: [{ user_id }, { community_id }],
      },
    });

    if (!member) {
      return next(
        new NotFoundException('User want to change not exist in this community')
      );
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

    member = await member.update({
      role,
    });
  } catch (error) {
    console.log(error);
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({
    messages: 'Role updated!',
    data: member,
  });
};

module.exports.changeOwner = async function (req, res, next) {
  const { new_owner, community_id } = req.query;
  const { id: user_id } = req.user;

  try {
    // check is want to change have role owner ?
    const ownerCommunity = await Community_Member.findOne({
      where: {
        [Op.and]: [{ user_id }, { community_id }, { role: 'owner' }],
      },
    });

    if (!ownerCommunity) {
      return next(new NotFoundException('You are not owner on this community'));
    }

    const newOwnerCommunity = await Community_Member.findOne({
      where: {
        [Op.and]: [{ user_id: new_owner }, { community_id }],
      },
    });

    if (!newOwnerCommunity) {
      return next(
        new ForbiddenException(
          'You must include new owner to change owner on this community'
        )
      );
    }

    await newOwnerCommunity.update({
      role: 'owner',
    });

    await newOwnerCommunity.update({
      role: 'member',
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({
    messages: 'Role updated',
  });
};

module.exports.leaveCommunity = async function (req, res, next) {
  const { id: user_id } = req.user;
  const { community_id } = req.query;

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
