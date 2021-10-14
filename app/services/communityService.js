const { Community, Community_Member, User } = require('../models/index');
const { Op } = require('sequelize');
const { NotFoundException } = require('../utils/httpExceptions');

/**
 *
 * @param {string} id community id
 */
const getCommunityDetail = async (id) => {
  const community = await Community.findOne({
    where: { id },
    include: {
      model: User,
      attributes: ['pk', 'id', 'name', 'email', 'profile_pict'],
      through: {
        attributes: ['created_at'],
        as: 'join_time',
      },
    },
  });

  if (!community) {
    throw new NotFoundException('Community not found');
  }

  return community;
};

/**
 *
 * @param {string} id community id
 */
const getCommunityTotalMember = async (id) => {
  const total_member = await Community_Member.count({
    where: { community_id: id },
  });

  return total_member;
};

/**
 *
 * @param {{name: string, type: string, description: string, community_pict: string, privacy: string}} createCommunityDto
 * @param {string} userId
 * @param {Object} file
 * @returns {Object} community
 */
const createCommunity = async (createCommunityDto, userId, file) => {
  let community_pict;
  if (file) {
    const { filename } = file;
    community_pict = `/assets/community_pict/${filename}`;
  }

  const community = await Community.create({
    ...createCommunityDto,
    community_pict,
  });

  const { id: community_id } = community;

  await Community_Member.create({
    community_id,
    role: 'owner',
    user_id: userId,
  });

  return community;
};

/**
 *
 * @param {{name: string, type: string, description: string, community_pict: string, privacy: string}} editCommunityDto
 * @param {string} id community id
 * @param {Array} files
 * @returns {object} community
 */
const editCommunity = async (editCommunityDto, id, files) => {
  let community_banner;
  let community_pict;

  if (files) {
    if (files.community_banner) {
      const { community_banner: communityBannerFile } = files;

      const { filename } = communityBannerFile[0];

      community_banner = `/assets/community/${filename}`;
    }

    if (files.community_pict) {
      const { community_pict: communityPictFile } = files;

      const { filename } = communityPictFile[0];

      community_pict = `/assets/community/${filename}`;
    }
  }

  let community = await Community.findOne({ where: { id } });

  if (!community) {
    throw new NotFoundException('Community not found');
  }

  community = await community.update({
    ...editCommunityDto,
    community_banner,
    community_pict,
  });

  return community;
};

/**
 *
 * @param {string} id community id
 * @returns {object} community
 */
const deleteCommunity = async (id) => {
  const community = await Community.destroy({ where: { id } });

  if (!community) {
    throw new NotFoundException('Community not found');
  }

  return community;
};

const getAllCommunity = async () => {
  const communities = await Community.findAll({
    order: [['created_at', 'DESC']],
  });

  return communities;
};

/**
 *
 * @param {string} key
 * @returns {object} community
 */
const findCommunity = async (key) => {
  const community = await Community.findAll({
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
