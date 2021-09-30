const db = require('../models/index');
const { Community, Community_Member, User } = require('../models/index');
const { Op } = require('sequelize');
const communityRouter = require('../routes/API/communityRoutes');
const {
  BadRequestException,
  InternalServerException,
} = require('../utils/httpExceptions');

module.exports.findCommunity = async function (req, res, next) {
  try {
    const findCommunities = await db.Community.findAll({
      where: {
        name: {
          [Op.iLike]: `%${req.params.key}%`,
        },
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'profile_pict'],
        },
      ],
    });

    return res.json({
      success: true,
      data: findCommunities,
    });
  } catch (error) {
    console.log(error);
    return next(new InternalServerException('Internal server error', error));
  }
};

module.exports.getCommunityDetails = async function (req, res, next) {
  const { id } = req.params;

  let community;
  let total_member;
  try {
    community = await Community.findOne({
      where: { id },
      include: {
        model: User,
        attributes: [
          'pk',
          'id',
          'name',
          'email',
          'profile_pict',
          // 'phone_number',
        ],
        through: {
          attributes: ['created_at'],
          as: 'join_time',
        },
      },
    });

    total_member = await Community_Member.count({
      where: { community_id: id },
    });
  } catch (error) {
    console.log(error);
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({
    data: {
      community,
      total_member,
    },
  });
};

module.exports.createCommunity = async function (req, res, next) {
  const { name, type, description, privacy } = req.body;
  const { id } = req.user;

  let community_pict = 'com_pict.jpg';

  if (req.file) {
    community_pict = req.file.filename;
  }

  let community;
  try {
    community = await Community.create({
      name,
      type,
      description,
      community_pict,
      privacy,
    });

    const community_id = community.id;

    await Community_Member.create({
      community_id,
      user_id: id,
      role: 'owner',
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return next(
        new BadRequestException(
          'Validation error',
          error.errors.map((e) => {
            return {
              attribute: e.path,
              message: e.message,
            };
          })
        )
      );
    }
    return next(new InternalServerException('Internal server error', error));
  }

  return res.status(201).json({
    messages: 'Community created',
    data: community,
  });
};

module.exports.editCommunity = async function (req, res, next) {
  const { id } = req.params;
  const { privacy, name, type, description } = req.body;

  console.log(privacy);

  let community_pict;

  if (req.file) {
    community_pict = req.file.filename;
  }

  let community;
  try {
    community = await db.Community.findOne({ where: { id } });

    community.update({
      name,
      type,
      description,
      community_pict,
      privacy,
    });
  } catch (error) {
    console.log(error);
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({
    message: 'Update Community Success',
    data: community,
  });
};

module.exports.deleteCommunity = async function (req, res, next) {
  const { id } = req.params;

  let community;
  try {
    community = await Community.destroy({ where: { id } });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }
  return res.status(200).json({
    messages: 'Delete success!',
    data: community,
  });
};

module.exports.getAllCommunity = async function (req, res, next) {
  let communities;
  try {
    communities = await Community.findAll();
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({ data: communities });
};
