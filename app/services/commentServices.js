const { Comment, User } = require('../models');
const {
  InternalServerException,
  BadRequestException,
  NotFoundException,
} = require('../utils/httpExceptions');

/**
 *
 * @param {{post_id: string, user_id: string, body: string}} postCommentDto
 * @param {filename: Object} file
 * @returns
 */
const postComment = async (postCommentDto, file) => {
  const { post_id, user_id, body } = postCommentDto;
  // validation
  if (!post_id && !user_id) {
    throw new BadRequestException('Post id or user id must not empty');
  }

  // check is comment body not empty or is there have image?
  if (!file && !body) {
    throw new BadRequestException(
      'Must at least send comment body or send an image'
    );
  }

  // make link path
  let imageUrl;
  if (file.filename) {
    const path =
      process.env.NODE_ENV === 'production'
        ? process.env.PRODUCTION_URL
        : process.env.LOCALHOST_URL;
    imageUrl = `${path}/assets/comment_pict/${file.filename}`;
  }

  let comment;

  try {
    comment = await Comment.create({
      ...postCommentDto,
      comment_pict: imageUrl,
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      throw new BadRequestException(
        'Validation error',
        error.errors.map((e) => ({ attribute: e.path, message: e.message }))
      );
    }
    throw new InternalServerException('Internal server error', error);
  }

  return comment;
};

/**
 *
 * @param {{post_id: string}} getCommentDto
 */
const getComments = async (getCommentDto) => {
  const { post_id } = getCommentDto;

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
  } catch (error) {
    throw new InternalServerException('Internal server error', error);
  }

  return comments;
};

/**
 *
 * @param {string} commentId
 */
const deleteComment = async (commentId) => {
  let comment;

  try {
    comment = await Comment.findOne({ where: { id: commentId } });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
  } catch (error) {
    throw new InternalServerException('Internal server error', error);
  }
};

module.exports = { postComment, getComments, deleteComment };
