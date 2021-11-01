const { Comment, Community_Member, User, sequelize } = require('../models');
const {
  BadRequestException,
  NotFoundException,
} = require('../utils/httpExceptions');
const urlJoin = require('url-join');
const config = require('config');

/**
 *
 * @param {{post_id: string, member_id: string, body: string}} postCommentDto
 * @param {filename: Object} file
 * @returns
 */
const postComment = async (postCommentDto, file) => {
  const { post_id, member_id, body } = postCommentDto;
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'), '/');

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
  let comment_uri;
  if (file) {
    comment_uri = file.filename;
  }

  const comment = await Comment.create(
    {
      ...postCommentDto,
      comment_uri,
    },
    {
      include: { model: Community_Member },
      attributes: {
        include: [
          [
            sequelize.fn('CONCAT', bucketUrl, sequelize.col('comment_uri')),
            'comment_pict',
          ],
        ],
        exlude: ['comment_uri'],
      },
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
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'), '/');

  const comments = await Comment.findAll({
    where: {
      post_id,
    },
    include: {
      model: Community_Member,
      required: true,
      include: User,
    },
    attributes: {
      include: [
        [
          sequelize.fn('CONCAT', bucketUrl, sequelize.col('comment_uri')),
          'comment_pict',
        ],
      ],
      exlude: ['comment_uri'],
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
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'), '/');

  const comment = await Comment.findOne({
    where: { id },
    include: { model: Community_Member, include: User },
    attributes: {
      include: [
        [
          sequelize.fn('CONCAT', bucketUrl, sequelize.col('comment_uri')),
          'comment_pict',
        ],
      ],
      exlude: ['comment_uri'],
    },
  });

  return comment;
};

module.exports = { postComment, getComments, deleteComment, getCommentDetail };
