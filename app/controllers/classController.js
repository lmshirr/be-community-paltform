const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const db = require('../models/index');
require('dotenv').config({ path: '../.env' });

module.exports.findClass = async function (req, res) {
  try {
    const findClass = await db.Class.findAll({
      where: {
        name: {
          [Op.iLike]: `%${req.params.key}%`,
        },
      },
    });
    return res.status(200).json({
      success: true,
      findClass,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.getClassDetails = async function (req, res) {
  try {
    const classDetails = await db.Class.findByPk(req.params.id);
    return res.status(200).json({
      success: true,
      classDetails,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.createClass = async function (req, res) {
  const { CommunityId, name, description } = req.body;
  const token = req.cookies.jwt;
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const { UserId } = decoded;
  const content = `There is a new class "${name}", go check it out!`;
  try {
    await db.Class.create({
      CommunityId,
      UserId,
      name,
      description,
    });
    await db.Community_Post.create({
      CommunityId,
      UserId,
      content,
    });
    res.status(200).json({
      success: true,
      message: 'Class Created',
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(200).json({
        success: false,
        errors: error.errors.map((e) => ({
          attribute: e.path,
          message: e.message,
        })),
      });
    }
    console.log(error);
    return res.status(200).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.editClass = async function (req, res) {
  try {
    const { name, description } = req.body;
    const classDetails = await db.Class.findByPk(req.params.id);
    classDetails.update({
      name,
      description,
    });
    return res.status(200).json({
      success: true,
      messages: 'Class updated!',
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.deleteClass = async function (req, res) {
  try {
    await db.Class.destroy({ where: { id: req.params.id } });
    return res.status(200).json({
      success: true,
      messages: 'Delete success!',
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      errors: error,
    });
  }
};
