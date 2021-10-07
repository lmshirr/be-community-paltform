const {
  InternalServerException,
  NotFoundException,
} = require('../utils/httpExceptions');
const { Comment, User } = require('../models');
const commentService = require('../services/commentServices');

module.exports.postComment = async (req, res, next) => {
  const { postId: post_id } = req.params;
  const { body } = req.body;
  const {
    id: user_id,
    email,
    given_name,
    profile_pict,
    locale,
    hd,
    name,
    google_id,
    verified_email,
    family_name,
  } = req.user;
  const { file } = req;

  let comment;
  try {
    comment = await commentService.postComment(
      { post_id, user_id, body },
      file
    );
  } catch (error) {
    return next(error);
  }

  // add user in response
  const user = {
    id: user_id,
    name,
    given_name,
    locale,
    email,
    hd,
    profile_pict,
    google_id,
    family_name,
    verified_email,
  };

  comment.setDataValue('User', user);

  return res.status(201).json({ message: 'Comment created', data: comment });
};

module.exports.getComments = async (req, res, next) => {
  const { postId: post_id } = req.params;

  let comments;

  try {
    comments = await commentService.getComments({ post_id });
  } catch (error) {
    return next(error);
  }

  return res.json({ data: comments });
};

module.exports.deleteComment = async (req, res, next) => {
  const { commentId } = req.params;

  let comment;
  try {
    comment = await commentService.deleteComment(commentId);
  } catch (error) {
    return next(error);
  }

  return res.json({ message: 'Comment deleted', data: comment });
};
