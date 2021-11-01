const {
  Community,
  Community_Member,
  User,
  sequelize,
} = require('../db/models');
const { Op } = require('sequelize');
const { NotFoundException } = require('../shared/utils/httpExceptions');
const { deleteFile } = require('../shared/utils/uploadFile/deleteFile');
const urlJoin = require('url-join');
const config = require('config');

/**
 *
 * @param {string} id community id
 * @returns {Object} community
 */
const getCommunityDetail = async (id) => {
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'), '/');

  const community = await Community.findOne({
    where: { id },
    include: {
      model: User,
      attributes: {
        include: [
          [
            sequelize.fn(
              'CONCAT',
              bucketUrl,
              sequelize.col('community_pict_uri')
            ),
            'community_pict',
          ],
          [
            sequelize.fn(
              'CONCAT',
              bucketUrl,
              sequelize.col('community_banner_uri')
            ),
            'community_banner',
          ],
          'pk',
          'id',
          'name',
          'email',
          'profile_pict',
        ],
        exclude: ['community_pict_uri', 'community_banner_uri'],
      },
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
  let community_pict_uri;
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'));

  if (file) {
    community_pict_uri = file.filename;
  }

  let community = await Community.create({
    ...createCommunityDto,
    community_pict_uri,
  });

  community = community.dataValues;

  await Community_Member.create({
    community_id: community.id,
    role: 'owner',
    user_id: userId,
  });

  delete community.community_pict_uri;
  delete community.community_banner_uri;

  return {
    ...community,
    community_pict: urlJoin(bucketUrl, community_pict_uri),
  };
};

/**
 *
 * @param {{name: string, type: string, description: string, community_pict: string, privacy: string}} editCommunityDto
 * @param {string} id community id
 * @param {Array} files
 * @returns {object} community
 */
const editCommunity = async (editCommunityDto, id, files) => {
  let community_banner_uri;
  let community_pict_uri;
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'));

  let community = await Community.findOne({ where: { id } });

  if (!community) {
    throw new NotFoundException('Community not found');
  }

  if (files) {
    if (files.community_banner) {
      const { community_banner: communityBannerFile } = files;

      // delete old file
      // await deleteFile(communityData.community_banner_uri);

      const { filename } = communityBannerFile[0];

      community_banner_uri = filename;
    }

    if (files.community_pict) {
      const { community_pict: communityPictFile } = files;

      // delete old file
      // await deleteFile(communityData.community_pict_uri);

      const { filename } = communityPictFile[0];

      community_pict_uri = filename;
    }
  }

  community = (
    await community.update({
      ...editCommunityDto,
      community_banner_uri,
      community_pict_uri,
    })
  ).get({ raw: true });

  const communityData = { ...community };

  delete community.community_banner_uri;
  delete community.community_pict_uri;

  return {
    ...community,
    community_banner: urlJoin(bucketUrl, communityData.community_banner_uri),
    community_pict: urlJoin(bucketUrl, communityData.community_pict_uri),
  };
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

/**
 * @param {string} meta
 * @returns {Array} communities
 */
const getAllCommunity = async (meta) => {
  let communities;
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'), '/');

  switch (meta) {
    case 'PUBLIC':
      communities = await Community.findAll({
        where: { privacy: 'public' },
        order: [['created_at', 'DESC']],
        attributes: {
          include: [
            [
              sequelize.fn(
                'CONCAT',
                bucketUrl,
                sequelize.col('community_pict_uri')
              ),
              'community_pict',
            ],
          ],
          exclude: ['community_pict_uri'],
        },
      });
      break;

    default:
      communities = await Community.findAll({
        where: { privacy: 'public' },
        order: [['created_at', 'DESC']],
        attributes: {
          include: [
            [
              sequelize.fn(
                'CONCAT',
                bucketUrl,
                sequelize.col('community_pict_uri')
              ),
              'community_pict',
            ],
            [
              sequelize.fn(
                'CONCAT',
                bucketUrl,
                sequelize.col('community_banner_uri')
              ),
              'community_banner',
            ],
          ],
          exclude: ['community_pict_uri', 'community_banner_uri'],
        },
      });
      break;
  }

  return communities;
};

/**
 *
 * @param {string} key
 * @returns {object} community
 */
const findCommunity = async (key) => {
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'), '/');

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
    attributes: {
      include: [
        [
          sequelize.fn(
            'CONCAT',
            bucketUrl,
            sequelize.col('community_pict_uri')
          ),
          'community_pict',
        ],
      ],
      exclude: ['community_pict_uri'],
    },
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
