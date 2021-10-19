/* eslint-disable no-underscore-dangle */
const { Class, Class_Enrollment, Community } = require('../models');
const { Op } = require('sequelize');
const {
  NotFoundException,
  ForbiddenException,
} = require('../utils/httpExceptions');

/**
 *
 * @param {{community_id: string, member_id: string, name: string, description: string, summary: string, about: string}} createClassDto
 * @param {Object} file
 * @returns dataClass
 */
const createClass = async (createClassDto, file) => {
  let banner_pict;

  if (file) {
    const { filename } = file;
    const path =
      process.env.NODE_ENV === 'production'
        ? process.env.PRODUCTION_URL
        : process.env.LOCALHOST_URL;

    banner_pict = `${path}/assets/class_banner/${filename}`;
  }

  const dataClass = await Class.create({ ...createClassDto, banner_pict });

  return dataClass;
};

/**
 *
 * @param {string} id class id
 * @param {{user_id: string, meta: string}} options meta=check_enrollment
 * @returns {classDetail: Object, student: boolean}
 */
const getClassDetail = async (classId, memberId, options) => {
  const { user_id, meta } = options;

  const classDetail = await Class.findOne({ where: { id: classId } });

  if (!classDetail) {
    throw new NotFoundException('Class not found');
  }

  let student;

  if (user_id && meta === 'check_enrollment') {
    student = await Class_Enrollment.findOne({
      where: { [Op.and]: [{ class_id: classId }, { member_id: memberId }] },
    });

    if (student) {
      student = true;
    } else {
      student = false;
    }
  }

  return { class: classDetail, student };
};

/**
 *
 * @param {string} id class id
 * @param {{name: string, summary: string, description: string, about: string}} editClassDto
 * @param {Object} file
 * @returns classData
 */
const editClass = async (id, editClassDto, file) => {
  let banner_pict;

  if (file) {
    banner_pict = file.filename;
  }

  let classData = await Class.findOne({ where: { id } });

  if (classData) {
    throw new NotFoundException('Class not found');
  }

  classData = await classData.update({ ...editClassDto, banner_pict });

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
  const classData = await Class.findAll({
    where: {
      [Op.and]: [{ community_id }, { name: { [Op.iLike]: `%${key}%` } }],
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
  let classes;

  switch (sort) {
    case 'recommended':
      classes = await Class.findAll({
        where: { community_id: communityId },
        order: [['students', 'DESC']],
      });
      break;
    case 'newest':
      classes = await Class.findAll({
        where: { community_id: communityId },
        order: [['created_at', 'DESC']],
      });
      break;
    case 'latest':
      classes = await Class.findAll({
        where: { community_id: communityId },
        order: [['created_at', 'ASC']],
      });
      break;
    default:
      classes = await Class.findAll({ where: { community_id: communityId } });
      break;
  }

  return classes;
};

/**
 *
 * @param {string} sort getClassSortBy recommended, newest, latest
 * @returns {Array} classes
 */
const getClasses = async (sort) => {
  let classes;

  switch (sort) {
    case 'recommended':
      classes = await Class.findAll({
        order: [
          ['students', 'DESC'],
          ['created_at', 'DESC'],
        ],
        include: { model: Community, required: true, attributes: ['name'] },
      });
      break;
    case 'newest':
      classes = await Class.findAll({
        order: [['created_at', 'DESC']],
      });
      break;
    case 'latest':
      classes = await Class.findAll({
        order: [['created_at', 'ASC']],
      });
      break;
    default:
      classes = await Class.findAll({ order: [['created_at', 'DESC']] });
      break;
  }

  return classes;
};

/**
 *
 * @param {{member_id: string, class_id: string}} createEnrollmentDto
 * @returns {Object} classEnrollment
 */
const createEnrollment = async (createEnrollmentDto) => {
  const { member_id, class_id } = createEnrollmentDto;

  // find is already enroll class ?
  const isAlreadyEnroll = await Class_Enrollment.findOne({
    where: { [Op.and]: [{ member_id }, { class_id }] },
  });

  if (isAlreadyEnroll) {
    throw new ForbiddenException('You already enroll this class');
  }

  const classEnrollment = await Class_Enrollment.create(createEnrollmentDto);

  if (classEnrollment) {
    // increment student in class
    const dataClass = await Class.findOne({ where: { id: class_id } });
    await dataClass.increment('students', { by: 1 });
  }

  return classEnrollment;
};

module.exports = {
  createEnrollment,
  createClass,
  getClassDetail,
  editClass,
  deleteClass,
  findClass,
  getClassInCommunity,
  getClasses,
};
