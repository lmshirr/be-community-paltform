const { Community, Community_Member, User } = require('../models/index');
const { Op } = require('sequelize');
const {
  NotFoundException,
  InternalServerException,
  BadRequestException,
} = require('../utils/httpExceptions');

/**
 *
 * @param {string} id community id
 */
const getCommunityDetail = async (id) => {
  let community;

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

    if (!community) {
      throw new NotFoundException('Community not found');
    }
  } catch (error) {
    throw new InternalServerException('Internal server error', error);
  }

  return community;
};

/**
 *
 * @param {string} id community id
 */
const getCommunityTotalMember = async (id) => {
  let total_member;

  try {
    total_member = await Community_Member.count({
      where: { community_id: id },
    });
  } catch (error) {
    throw new InternalServerException('Internal server error', error);
  }

  return total_member;
};

/**
 *
 * @param {{name: string, type: string, description: string, community_pict: string, privacy: string}} createCommunityDto
 * @param {string} userId
 * @returns {object} community
 */
const createCommunity = async (createCommunityDto, userId) => {
  let community;

  try {
    community = await Community.create(createCommunityDto);

    const { id: community_id } = community;

    await Community_Member.create({
      community_id,
      role: 'owner',
      user_id: userId,
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      throw new BadRequestException(
        'Validation error',
        error.errors.map((e) => {
          return {
            attribute: e.path,
            message: e.message,
          };
        })
      );
    }
    throw new InternalServerException('Internal server error', error);
  }

  return community;
};

/**
 *
 * @param {{name: string, type: string, description: string, community_pict: string, privacy: string}} editCommunityDto
 * @param {string} id community id
 * @returns {object} community
 */
const editCommunity = async (editCommunityDto, id) => {
  let community;

  try {
    community = await Community.findOne({ where: { id } });

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    community = await community.update(editCommunityDto);
  } catch (error) {
    throw new InternalServerException('Internal server error', error);
  }

  return community;
};

/**
 *
 * @param {string} id community id
 * @returns {object} community
 */
const deleteCommunity = async (id) => {
  let community;

  try {
    community = await Community.destroy({ where: { id } });

    if (!community) {
      throw new NotFoundException('Community not found');
    }
  } catch (error) {
    throw new InternalServerException('Internal server error', error);
  }

  return community;
};

const getAllCommunity = async () => {
  let communities;

  try {
    communities = await Community.findAll({
      order: [['created_at', 'DESC']],
    });
  } catch (error) {
    throw new InternalServerException('Internal server error', error);
  }

  return communities;
};

/**
 *
 * @param {string} key
 * @returns {object} community
 */
const findCommunity = async (key) => {
  let community;

  try {
    community = await Community.findAll({
      where: {
        name: {
          [Op.iLike]: `%${key}%`,
        },
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'profile_pict'],
        },
      ],
    });
  } catch (error) {
    throw new InternalServerException('Internal server error', error);
  }

  return community;
};

module.exports = {
  getCommunityDetail,
  getCommunityTotalMember,
  createCommunity,
  editCommunity,
  deleteCommunity,
  getAllCommunity,
  findCommunity,
};
