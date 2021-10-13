/* eslint-disable no-underscore-dangle */
const classService = require('../services/classService');
const communityPostService = require('../services/communityPostService');

module.exports.findClass = async (req, res, next) => {
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

module.exports.getClassDetail = async (req, res, next) => {
  const { classId: id } = req.params;

  let classDetail;

  try {
    classDetail = await classService.getClassDetail(id);
  } catch (error) {
    return next(error);
  }

  return res.json({
    data: classDetail,
  });
};

module.exports.createClass = async (req, res, next) => {
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

module.exports.editClass = async (req, res, next) => {
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

module.exports.deleteClass = async (req, res, next) => {
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

module.exports.getClassInCommunity = async (req, res, next) => {
  const { id: communityId } = req.params;

  let classes;

  try {
    classes = await classService.getClassInCommunity(communityId);
  } catch (error) {
    return next(error);
  }

  return res.json({ data: classes });
};
