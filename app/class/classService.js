/* eslint-disable no-underscore-dangle */
const { Class, Community, sequelize } = require('../shared/db/models');
const { Op } = require('sequelize');
const { NotFoundException } = require('../shared/utils/httpExceptions');
const config = require('config');
const urlJoin = require('url-join');

/**
 *
 * @param {{community_id: string, member_id: string, name: string, description: string, summary: string, about: string}} createClassDto
 * @param {Object} file
 * @returns dataClass
 */
const createClass = async (createClassDto, file) => {
  let banner_uri;
  const bucketUrl = config.get('GCS.bucket_url');

  if (file) {
    banner_uri = file.filename;
  }

  const { dataValues } = await Class.create({ ...createClassDto, banner_uri });

  if (!banner_uri) {
    return {
      ...dataValues,
      banner_pict: urlJoin(bucketUrl, dataValues.banner_uri),
    };
  }

  return {
    ...dataValues,
    banner_pict: urlJoin(bucketUrl, banner_uri),
  };
};

/**
 *
 * @param {string} classId class id
 * @returns {Object} classDetail
 */
const getClassDetail = async (classId) => {
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'), '/');

  const classDetail = await Class.findOne({
    where: { id: classId },
    attributes: {
      include: [
        [
          sequelize.fn('CONCAT', bucketUrl, sequelize.col('banner_uri')),
          'banner_pict',
        ],
      ],
      exclude: ['banner_uri'],
    },
  });

  if (!classDetail) {
    throw new NotFoundException('Class not found');
  }

  return classDetail;
};

/**
 *
 * @param {string} id class id
 * @param {{name: string, summary: string, description: string, about: string}} editClassDto
 * @param {Object} file
 * @returns classData
 */
const editClass = async (id, editClassDto, file) => {
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'), '/');

  let banner_uri;

  if (file) {
    banner_uri = file.filename;
  }

  let classData = await Class.findOne({
    where: { id },
    attributes: {
      include: [
        [
          sequelize.fn('CONCAT', bucketUrl, sequelize.col('banner_uri')),
          'banner_pict',
        ],
      ],
      exclude: ['banner_uri'],
    },
  });

  if (!classData) {
    throw new NotFoundException('Class not found');
  }

  classData = await classData.update({ ...editClassDto, banner_uri });

  return classData;
};

/**
 *
 * @param {string} id class id
 */
const deleteClass = async (id) => {
  const classData = await Class.destroy({ where: { id } });

  if (!classData) {
    throw new NotFoundException('Class not found');
  }
};

/**
 *
 * @param {string} community_id
 * @param {string} key search key by name
 * @returns classData
 */
const findClass = async (community_id, key) => {
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'), '/');

  const classData = await Class.findAll({
    where: {
      [Op.and]: [{ community_id }, { name: { [Op.iLike]: `%${key}%` } }],
    },
    attributes: {
      include: [
        [
          sequelize.fn('CONCAT', bucketUrl, sequelize.col('banner_uri')),
          'banner_pict',
        ],
      ],
      exclude: ['banner_uri'],
    },
  });

  if (!classData) {
    throw new NotFoundException('Class not found');
  }

  return classData;
};

/**
 *
 * @param {string} communityId community id
 * @param {string} sort getClassSortBy recommended, newest, latest
 * @returns {Array} classes
 */
const getClassInCommunity = async (communityId, sort) => {
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'), '/');

  let classes;

  switch (sort) {
    case 'newest':
      classes = await Class.findAll({
        where: { community_id: communityId },
        include: { model: Community },
        order: [['created_at', 'DESC']],
        attributes: {
          include: [
            [
              sequelize.fn('CONCAT', bucketUrl, sequelize.col('banner_uri')),
              'banner_pict',
            ],
          ],
          exclude: ['banner_uri'],
        },
      });
      break;
    case 'latest':
      classes = await Class.findAll({
        where: { community_id: communityId },
        order: [['created_at', 'ASC']],
        include: { model: Community },
        attributes: {
          include: [
            [
              sequelize.fn('CONCAT', bucketUrl, sequelize.col('banner_uri')),
              'banner_pict',
            ],
          ],
          exclude: ['banner_uri'],
        },
      });
      break;
    default:
      classes = await Class.findAll({
        where: { community_id: communityId },
        include: { model: Community },
        attributes: {
          include: [
            [
              sequelize.fn('CONCAT', bucketUrl, sequelize.col('banner_uri')),
              'banner_pict',
            ],
          ],
          exclude: ['banner_uri'],
        },
      });
      break;
  }

  return classes;
};

/**
 *
 * @param {string} sort getClassSortBy recommended, newest
 * @returns {Array} classes
 */
const getClasses = async (sort, types, limit, offset) => {
  let classes;
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'), '/');

  if (!types.length) {
    switch (sort) {
      case 'newest':
        return Class.findAll({
          order: [['created_at', 'DESC']],
          include: { model: Community },
          attributes: {
            include: [
              [
                sequelize.fn('CONCAT', bucketUrl, sequelize.col('banner_uri')),
                'banner_pict',
              ],
            ],
            exclude: ['banner_uri'],
          },
          limit,
          offset,
        });
      case 'recommended':
        return Class.findAll({
          order: [['created_at', 'DESC']],
          include: { model: Community },
          attributes: {
            include: [
              [
                sequelize.fn('CONCAT', bucketUrl, sequelize.col('banner_uri')),
                'banner_pict',
              ],
            ],
            exclude: ['banner_uri'],
          },
          limit,
          offset,
        });
      default:
        return Class.findAll({
          order: [['created_at', 'DESC']],
          include: { model: Community },
          attributes: {
            include: [
              [
                sequelize.fn('CONCAT', bucketUrl, sequelize.col('banner_uri')),
                'banner_pict',
              ],
            ],
            exclude: ['banner_uri'],
          },
          limit,
          offset,
        });
    }
  }

  if (sort === 'newest') {
    classes = await Class.findAll({
      order: [['created_at', 'DESC']],
      include: {
        model: Community,
        where: {
          type: { [Op.in]: types },
        },
      },
      attributes: {
        include: [
          [
            sequelize.fn('CONCAT', bucketUrl, sequelize.col('banner_uri')),
            'banner_pict',
          ],
        ],
        exclude: ['banner_uri'],
      },
      limit,
      offset,
    });
  } else if (sort === 'recommended') {
    classes = await Class.findAll({
      order: [['created_at', 'DESC']],
      include: {
        model: Community,
        where: {
          type: { [Op.in]: types },
        },
      },
      attributes: {
        include: [
          [
            sequelize.fn('CONCAT', bucketUrl, sequelize.col('banner_uri')),
            'banner_pict',
          ],
        ],
        exclude: ['banner_uri'],
      },
      limit,
      offset,
    });
  }
  return classes;
};

module.exports = {
  createClass,
  getClassDetail,
  editClass,
  deleteClass,
  findClass,
  getClassInCommunity,
  getClasses,
};
