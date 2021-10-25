const {
  Community_Post,
  User,
  Community_Member,
  Community_Post_Attachment,
} = require('../models/index');
const { NotFoundException } = require('../utils/httpExceptions');
const urlJoin = require('url-join');

/**
 *
 * @param {{community_id: string, member_id: string, content: string}} createPostDto
 * @param {Object} files
 * @returns post
 */
const createPost = async (createPostDto, files) => {
  let post;

  post = await Community_Post.create(createPostDto);

  const { id: postId } = post.dataValues;

  if (files) {
    files.forEach(async (file) => {
      const cloudUrl = process.env.GCS_URL;
      const bucketName = process.env.BUCKET_NAME;

      const file_url = urlJoin(cloudUrl, bucketName, file.filename);

      await Community_Post_Attachment.create({
        community_post_id: postId,
        filename: file_url,
      });
    });
  }

  // get post
  post = await Community_Post.findOne({
    where: { id: postId },
    include: [{ model: Community_Member, include: User }],
  });

  return post;
};

/**
 *
 * @param {string} id post id
 * @returns post
 */
const getPostDetail = async (id) => {
  const post = await Community_Post.findOne({
    where: { id },
    include: [
      {
        model: Community_Member,
        required: true,
      },
      {
        model: Community_Post_Attachment,
        required: true,
      },
    ],
  });

  if (!post) {
    throw new NotFoundException('Post not found');
  }

  return post;
};

/**
 *
 * @param {string} communityId
 * @returns post
 */
const getPostInCommunity = async (community_id) => {
  const post = await Community_Post.findAll({
    where: {
      community_id,
    },
    include: [
      { model: Community_Post_Attachment },
      { model: Community_Member, include: User },
    ],
    order: [['created_at', 'DESC']],
  });

  return post;
};

/**
 *
 * @param {{content: string}} editPostDto
 * @param {string} post_id
 * @param {Array} files
 * @returns post
 */
const editPost = async (editPostDto, post_id, files) => {
  let post;

  post = await Community_Post.findOne({ where: { id: post_id } });

  if (!post) {
    throw new NotFoundException('Post not found');
  }

  post = await post.update(editPostDto);

  if (files) {
    files.forEach(async (file) => {
      const cloudUrl = process.env.GCS_URL;
      const bucketName = process.env.BUCKET_NAME;

      const file_url = urlJoin(cloudUrl, bucketName, file.filename);

      await Community_Post_Attachment.create({
        community_post_id: post_id,
        filename: file_url,
      });
    });
  }

  return post;
};

/**
 *
 * @param {string} id
 * @returns post
 */
const deletePost = async (id) => {
  const post = await Community_Post.destroy({ where: { id } });

  if (!post) {
    throw new NotFoundException('Post not found');
  }

  return post;
};

/**
 *
 * @param {string} id
 * @returns community_post_attachment
 */
const deleteAttachment = async (id) => {
  const community_post_attachment = await Community_Post_Attachment.destroy({
    where: { id },
  });

  return community_post_attachment;
};

module.exports = {
  createPost,
  getPostDetail,
  getPostInCommunity,
  editPost,
  deletePost,
  deleteAttachment,
};
