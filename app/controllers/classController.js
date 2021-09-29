const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { Class, Community_Post } = require('../models/index');
const {
  InternalServerException,
  BadRequestException,
} = require('../utils/httpExceptions');

module.exports.findClass = async function (req, res, next) {
  try {
    const findClass = await Class.findAll({
      where: {
        name: {
          [Op.iLike]: `%${req.params.key}%`,
        },
      },
    });
    return res.json({
      success: true,
      findClass,
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }
};

module.exports.getClassDetails = async function (req, res, next) {
  const { id } = req.params;

  try {
    const classDetails = await Class.findOne({ where: { id } });

    return res.json({
      data: classDetails,
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }
};

module.exports.createClass = async function (req, res, next) {
  const { community_id, name, description } = req.body;
  const { user_id } = req.user;
  const content = `There is a new class "${name}", go check it out!`;

  let dataClass;
  try {
    dataClass = await Class.create({
      community_id,
      user_id,
      name,
      description,
    });

    // create post info
    await Community_Post.create({
      community_id,
      user_id,
      content,
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return BadRequestException(
        'Validation error',
        error.errors.map((e) => ({
          attribute: e.path,
          message: e.message,
        }))
      );
    }
    console.log(error);
    return next(new InternalServerException('Internal server error', error));
  }

  res.status(201).json({
    message: 'Class Created',
    data: dataClass,
  });
};

module.exports.editClass = async function (req, res, next) {
  try {
    const { name, description } = req.body;
    const classDetails = await Class.findByPk(req.params.id);
    classDetails.update({
      name,
      description,
    });
    return res.status(200).json({
      success: true,
      messages: 'Class updated!',
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }
};

module.exports.deleteClass = async function (req, res, next) {
  try {
    await Class.destroy({ where: { id: req.params.id } });
    return res.status(200).json({
      success: true,
      messages: 'Delete success!',
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }
};
