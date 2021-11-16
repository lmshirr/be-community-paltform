/* eslint-disable no-underscore-dangle */
const classService = require('./classService');
const communityPostService = require('../communityPost/communityPostService');

const findClass = async (req, res, next) => {
  const { key } = req.query;
  const { communityId } = req.params;

  let _class;

  try {
    _class = await classService.findClass(communityId, key);
  } catch (error) {
    return next(error);
  }

  return res.json({
    data: _class,
  });
};

const getClassDetail = async (req, res, next) => {
  const { classId } = req.params;

  let data;

  try {
    data = await classService.getClassDetail(classId);
  } catch (error) {
    return next(error);
  }

  return res.json(data);
};

const createClass = async (req, res, next) => {
  const { name, description, summary, about } = req.body;
  const { id: member_id } = req.member;
  const { communityId: community_id } = req.params;
  const { file } = req;

  let dataClass;
  let post;

  try {
    dataClass = await classService.createClass(
      {
        community_id,
        member_id,
        name,
        description,
        summary,
        about,
      },
      file
    );

    // create post info
    const content = `There is a new class ${name}, go check it out!`;

    post = await communityPostService.createPost({
      community_id,
      member_id,
      content,
    });
  } catch (error) {
    return next(error);
  }

  res.status(201).json({
    message: 'Class Created',
    data: { class: dataClass, post },
  });
};

const editClass = async (req, res, next) => {
  const { classId } = req.params;
  const { name, description, summary, about } = req.body;
  const { file } = req;

  let _class;
  try {
    _class = await classService.editClass(
      classId,
      { about, description, summary, name },
      file
    );
  } catch (error) {
    return next(error);
  }

  return res.json({
    messages: 'Class updated!',
    data: _class,
  });
};

const deleteClass = async (req, res, next) => {
  const { classId } = req.params;

  try {
    await classService.deleteClass(classId);
  } catch (error) {
    return next(error);
  }

  return res.json({
    messages: 'Delete success!',
  });
};

const getClassInCommunity = async (req, res, next) => {
  const { communityId } = req.params;
  const { sort } = req.query;

  let classes;

  try {
    classes = await classService.getClassInCommunity(communityId, sort);
  } catch (error) {
    return next(error);
  }

  return res.json({ data: classes });
};

const getClasses = async (req, res, next) => {
  // const { sort, value } = req.query;
  const { sort, type, attribute, order } = req.query;

  let classes;

  try {
    // convert order
    const orderBy = order === 'asc' ? 'ASC' : 'DESC';

    // classes = await classService.getClasses(sort, value);
    classes = await classService.getClasses(sort, attribute, type, order);
  } catch (error) {
    return next(error);
  }

  return res.json({ data: classes });
};

module.exports = {
  getClassInCommunity,
  deleteClass,
  editClass,
  createClass,
  findClass,
  getClassDetail,
  getClasses,
};
