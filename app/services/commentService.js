const { Comment, Community_Member, User } = require('../models');
const {
  BadRequestException,
  NotFoundException,
} = require('../utils/httpExceptions');
const urlJoin = require('url-join');

/**
 *
 * @param {{post_id: string, member_id: string, body: string}} postCommentDto
 * @param {filename: Object} file
 * @returns
 */
const postComment = async (postCommentDto, file) => {
  const { post_id, member_id, body } = postCommentDto;
  // validation
  if (!post_id && !member_id) {
    throw new BadRequestException('Post id or user id must not empty');
  }

  // check is comment body not empty or is there have image?
  if (!file && !body) {
    throw new BadRequestException(
      'Must at least send comment body or send an image'
    );
  }

  // make link path
  let comment_pict;
  if (file) {
    const cloudUrl = process.env.GCS_URL;
    const bucketName = process.env.BUCKET_NAME;

    comment_pict = urlJoin(cloudUrl, bucketName, file.filename);
  }

  const comment = await Comment.create(
    {
      ...postCommentDto,
      comment_pict,
    },
    {
      include: { model: Community_Member },
    }
  );

  return comment;
};

/**
 *
 * @param {{post_id: string}} getCommentDto
 */
const getComments = async (getCommentDto) => {
  const { post_id } = getCommentDto;

  const comments = await Comment.findAll({
    where: {
      post_id,
    },
    include: {
      model: Community_Member,
      required: true,
      include: User,
    },
  });

  return comments;
};

/**
 *
 * @param {string} commentId
 * @returns comment
 */
const deleteComment = async (commentId) => {
  let comment = await Comment.findOne({ where: { id: commentId } });

  if (!comment) {
    throw new NotFoundException('Comment not found');
  }

  comment = await comment.destroy();

  return comment;
};

/**
 *
 * @param {string} id
 * @returns comment
 */
const getCommentDetail = async (id) => {
  const comment = await Comment.findOne({
    where: { id },
    include: { model: Community_Member, include: User },
  });

  return comment;
};

module.exports = { postComment, getComments, deleteComment, getCommentDetail };
