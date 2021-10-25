/* eslint-disable no-underscore-dangle */
const classService = require('../services/classService');
const communityPostService = require('../services/communityPostService');

const findClass = async (req, res, next) => {
  const { key } = req.query;
  const { id: communityId } = req.params;

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
  const { user_id, meta } = req.query;
  const { id: memberId } = req.member;

  let data;

  try {
    data = await classService.getClassDetail(classId, memberId, {
      user_id,
      meta,
    });
  } catch (error) {
    return next(error);
  }

  return res.json(data);
};

const createClass = async (req, res, next) => {
  const { name, description, summary, about } = req.body;
  const { id: member_id } = req.member;
  const { id: community_id } = req.params;
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
    data: { dataClass, post },
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
  const { id: communityId } = req.params;
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
  const { sort } = req.query;

  let classes;

  try {
    classes = await classService.getClasses(sort);
  } catch (error) {
    return next(error);
  }

  return res.json({ data: classes });
};

const enrollUser = async (req, res, next) => {
  const { id: member_id } = req.member;
  const { id: community_id, classId: class_id } = req.params;

  let classEnrollment;
  try {
    classEnrollment = await classService.createEnrollment({
      community_id,
      member_id,
      class_id,
    });
  } catch (error) {
    return next(error);
  }

  return res.status(201).json({
    message: 'Enroll class success',
    data: classEnrollment,
  });
};

module.exports = {
  getClassInCommunity,
  deleteClass,
  editClass,
  createClass,
  findClass,
  getClassDetail,
  getClasses,
  enrollUser,
};
