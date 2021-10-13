/* eslint-disable no-underscore-dangle */
const { Class } = require('../models/index');
const { Op } = require('sequelize');
const { NotFoundException } = require('../utils/httpExceptions');

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
 * @returns classDetail
 */
const getClassDetail = async (id) => {
  const classDetail = await Class.findOne({ where: { id } });

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
 * @param {string} id community id
 * @returns
 */
const getClassInCommunity = async (id) => {
  const classes = await Class.findAll({ where: { community_id: id } });

  return classes;
};

module.exports = {
  createClass,
  getClassDetail,
  editClass,
  deleteClass,
  findClass,
  getClassInCommunity,
};