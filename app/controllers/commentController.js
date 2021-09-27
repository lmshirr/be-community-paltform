const { postCommentValidator } = require('../utils/validator/commentValidator');
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
  const { post_id, user_id } = req.query;
  const { body } = req.body;

  const { isValidate, errors } = postCommentValidator(post_id, user_id, body);

  // if doesnt have query or body throw bad request
  if (!isValidate)
    return next(
      new BadRequestException('Query or body must not empty', errors)
    );

  let comment;
  try {
    comment = await Comment.create({ post_id, body, user_id });
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
    return next(new InternalServerException());
  }

  return res.status(201).json({ message: 'Comment created', data: comment });
};

module.exports.getComments = async (req, res, next) => {
  const { post_id } = req.query;

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
