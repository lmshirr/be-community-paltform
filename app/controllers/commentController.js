const {
  BadRequestException,
  InternalServerException,
} = require('../utils/httpExceptions');
const { Comment, User } = require('../models');

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
module.exports.postComment = async (req, res, next) => {
  const { postId: post_id } = req.params;
  const { body } = req.body;
  const { id: user_id } = req.user;
  const { file } = req;

  // if doesnt have query or body throw bad request
  if (!post_id || !user_id) {
    return next(new BadRequestException('Post id or user id must not empty'));
  }

  console.log(!file);
  // check is comment body not empty or is there have image?
  if (!file && !body) {
    return next(
      new BadRequestException(
        'Must at least send comment body or send an image'
      )
    );
  }

  let comment;
  try {
    comment = await Comment.create({
      post_id,
      body,
      user_id,
      // comment_pict: file?.filename,
      comment_pict: file.filename,
    });
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return next(
        new BadRequestException(
          'Validation error',
          err.errors.map((e) => ({ attribute: e.path, message: e.message }))
        )
      );
    }
    console.log(err);
    return next(new InternalServerException('Internal server error', err));
  }

  return res.status(201).json({ message: 'Comment created', data: comment });
};

module.exports.getComments = async (req, res, next) => {
  const { postId: post_id } = req.params;

  console.log(post_id);

  let comments;
  try {
    comments = await Comment.findAll({
      where: {
        post_id,
      },
      include: {
        model: User,
        required: true,
      },
    });
  } catch (err) {
    console.log(err);
    return next(new InternalServerException());
  }

  return res.json({ data: comments });
};
