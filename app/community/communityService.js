const {
  Community,
  Community_Member,
  User,
  sequelize,
} = require('../shared/db/models');
const { Op, QueryTypes } = require('sequelize');
const { NotFoundException } = require('../shared/utils/httpExceptions');
const { deleteFile } = require('../shared/utils/cloudStorage');
const urlJoin = require('url-join');
const config = require('config');
const { TYPE, NAME, POPULAR } = require('./constant');

/**
 *
 * @param {string} id community id
 * @returns {Object} community
 */
async function getCommunityDetail(id) {
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'), '/');

  const community = await Community.findOne({
    where: { id },
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
    include: {
      model: User,
      attributes: {
        include: ['pk', 'id', 'name', 'email', 'profile_pict'],
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
}

/**
 *
 * @param {string} id community id
 */
async function getCommunityTotalMember(id) {
  const total_member = await Community_Member.count({
    where: { community_id: id },
  });

  return total_member;
}

/**
 *
 * @param {{name: string, type: string, description: string, community_pict: string, privacy: string}} createCommunityDto
 * @param {string} userId
 * @param {Object} file
 * @returns {Object} community
 */
async function createCommunity(createCommunityDto, userId, file) {
  let community_pict_uri;
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'));

  if (file) {
    community_pict_uri = file.filename;
  }

  let { dataValues: community } = await Community.create({
    ...createCommunityDto,
    community_pict_uri,
  });

  community = {
    ...community,
    community_pict: urlJoin(bucketUrl, community.community_pict_uri),
    community_banner: urlJoin(bucketUrl, community.community_banner_uri),
  };

  await Community_Member.create({
    community_id: community.id,
    role: 'owner',
    user_id: userId,
  });

  delete community.community_pict_uri;
  delete community.community_banner_uri;

  return community;
}

/**
 *
 * @param {{name: string, type: string, description: string, community_pict: string, privacy: string}} editCommunityDto
 * @param {string} id community id
 * @param {Array} files
 * @returns {object} community
 */
async function editCommunity(editCommunityDto, id, files) {
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
}

/**
 *
 * @param {string} id community id
 * @returns {object} community
 */
async function deleteCommunity(id) {
  const community = await Community.destroy({ where: { id } });

  if (!community) {
    throw new NotFoundException('Community not found');
  }

  return community;
}

/**
 * @param {string} filter
 * @params {string} value
 * @returns {Array} communities
 */
async function getCommunities(filter, value) {
  let communities;
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'), '/');

  switch (filter) {
    case TYPE:
      communities = await Community.findAll({
        where: { type: value, privacy: 'public' },
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
          exclude: ['community_pict_uri'],
        },
      });
      break;

    case NAME:
      communities = await Community.findAll({
        where: { privacy: 'public' },
        order: [
          ['name', 'ASC'],
          ['created_at', 'DESC'],
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
            [
              sequelize.fn(
                'CONCAT',
                bucketUrl,
                sequelize.col('community_banner_uri')
              ),
              'community_banner',
            ],
          ],
          exclude: [
            'pk',
            'created_at',
            'updated_at',
            'community_pict_uri',
            'community_banner_uri',
          ],
        },
        include: [
          {
            model: Community_Member,
            attributes: {
              exclude: [
                'created_at',
                'updated_at',
                'pk',
                'user_id',
                'id',
                'community_id',
              ],
            },
            include: {
              model: User,
              attributes: {
                exclude: [
                  'id',
                  'created_at',
                  'updated_at',
                  'locale',
                  'hd',
                  'google_id',
                  'verified_email',
                ],
              },
            },
          },
        ],
      });
      break;

    // case POPULAR:
    //   break;

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
          exclude: [
            'pk',
            'created_at',
            'updated_at',
            'community_pict_uri',
            'community_banner_uri',
          ],
        },
        include: [
          {
            model: Community_Member,
            attributes: {
              exclude: [
                'created_at',
                'updated_at',
                'pk',
                'user_id',
                'id',
                'community_id',
              ],
            },
            include: {
              model: User,
              attributes: {
                exclude: [
                  'id',
                  'created_at',
                  'updated_at',
                  'locale',
                  'hd',
                  'google_id',
                  'verified_email',
                ],
              },
            },
          },
        ],
      });
      break;
  }

  return communities;
}

/**
 *
 * @param {string} key
 * @returns {object} community
 */
async function findCommunity(key) {
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
}

/**
 *
 * @param {string} userId
 */
async function checkMember(communityId, userId) {
  const member = await Community_Member.findOne({
    where: {
      [Op.and]: [{ user_id: userId }, { community_id: communityId }],
    },
    include: [User],
  });

  if (!member) {
    throw new NotFoundException('User is not a member in this community');
  }

  return member;
}

module.exports = {
  getCommunityDetail,
  getCommunityTotalMember,
  createCommunity,
  editCommunity,
  deleteCommunity,
  getCommunities,
  findCommunity,
  checkMember,
};
