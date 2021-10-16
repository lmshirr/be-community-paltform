/* eslint-disable no-underscore-dangle */
const { User } = require('../models/index');
const { Op } = require('sequelize');
const { NotFoundException } = require('../utils/httpExceptions');

/**
 *
 * @param {{google_id: string, email: string, verified_email: boolean, name: string, given_name: string, family_name: string, profile_pict: string, locale: string, hd: string}} createUserDto
 * @returns dataUser
 */
const createUser = async (createUserDto) => {
  console.log(createUserDto);
  // const dataUser = await User.create({ ...createUserDto });
  const dataUser = await User.create(createUserDto);
  return dataUser;
};

/**
 *
 * @param {string} id user id
 * @returns userDetail
 */
const getUserDetail = async (id) => {
  const userDetail = await User.findOne({ where: { id } });

  if (!userDetail) {
    throw new NotFoundException('User not found');
  }

  return userDetail;
};

/**
 *
 * @param {string} id user id
 */
const deleteUser = async (id) => {
  const userData = await User.destroy({ where: { id } });

  if (!userData) {
    throw new NotFoundException('User not found');
  }
};

/**
 *
 * @param {string} community_id
 * @param {string} key search key by name
 * @returns userData
 */
const findUser = async (community_id, key) => {
  const userData = await User.findAll({
    where: {
      [Op.and]: [{ community_id }, { name: { [Op.iLike]: `%${key}%` } }],
    },
  });

  if (!userData) {
    throw new NotFoundException('User not found');
  }

  return userData;
};

/**
 *
 * @param {string} id community id
 * @returns
 */
const getUserInCommunity = async (id) => {
  const users = await User.findAll({ where: { community_id: id } });

  return users;
};

module.exports = {
  createUser,
  getUserDetail,
  deleteUser,
  findUser,
  getUserInCommunity,
};
