const {
  Community_Post,
  User,
  Community_Member,
  Community_Post_Attachment,
  sequelize,
} = require('../shared/db/models');
const { NotFoundException } = require('../shared/utils/httpExceptions');
const urlJoin = require('url-join');
const config = require('config');

/**
 *
 * @param {{community_id: string, member_id: string, content: string}} createPostDto
 * @param {Object} files
 * @returns post
 */
const createPost = async (createPostDto, files) => {
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'), '/');
  let post;

  post = await Community_Post.create(createPostDto);

  const { id: postId } = post.dataValues;

  if (files) {
    const arrFiles = files.map((file) => {
      const file_url = file.filename;
      return { filename: file_url, community_post_id: postId };
    });
    await Community_Post_Attachment.bulkCreate(arrFiles);
  }

  // get post
  post = await Community_Post.findOne({
    where: { id: postId },
    attributes: {
      exclude: ['pk', 'member_id', 'community_id'],
    },
    include: [
      {
        model: Community_Member,
        attributes: {
          exclude: [
            'pk',
            'user_id',
            'community_id',
            'created_at',
            'updated_at',
          ],
        },
        include: {
          model: User,
          attributes: {
            exclude: ['pk', 'verified_email', 'created_at', 'updated_at'],
          },
        },
      },
      {
        model: Community_Post_Attachment,
        attributes: {
          exclude: ['pk', 'community_post_id', 'filename'],
          include: [
            [
              sequelize.fn('CONCAT', bucketUrl, sequelize.col('filename')),
              'post_pict',
            ],
          ],
        },
      },
    ],
  });

  return post;
};

/**
 *
 * @param {string} id post id
 * @returns post
 */
const getPostDetail = async (id) => {
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'), '/');

  const post = await Community_Post.findOne({
    where: { id },
    attributes: {
      exclude: ['pk', 'member_id', 'community_id'],
    },
    include: [
      {
        model: Community_Member,
        attributes: {
          exclude: [
            'pk',
            'user_id',
            'community_id',
            'created_at',
            'updated_at',
          ],
        },
        include: {
          model: User,
          attributes: {
            exclude: ['pk', 'verified_email', 'created_at', 'updated_at'],
          },
        },
      },
      {
        model: Community_Post_Attachment,
        attributes: {
          include: [
            [
              sequelize.fn('CONCAT', bucketUrl, sequelize.fn('filename')),
              'post_pict',
            ],
          ],
          exclude: ['filename', 'community_post_id', 'pk'],
        },
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
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'), '/');

  const post = await Community_Post.findAll({
    where: {
      community_id,
    },
    attributes: {
      exclude: ['pk', 'member_id', 'community_id'],
    },
    include: [
      {
        model: Community_Post_Attachment,
        attributes: {
          include: [
            [
              sequelize.fn('CONCAT', bucketUrl, sequelize.col('filename')),
              'post_pict',
            ],
          ],
          exclude: ['filename', 'community_post_id', 'pk'],
        },
      },
      {
        model: Community_Member,
        attributes: {
          exclude: [
            'pk',
            'user_id',
            'community_id',
            'created_at',
            'updated_at',
          ],
        },
        include: {
          model: User,
          attributes: {
            exclude: ['pk', 'verified_email', 'created_at', 'updated_at'],
          },
        },
      },
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
    const arrFiles = files.map((file) => {
      const file_url = file.filename;
      return { filename: file_url, community_post_id: post_id };
    });

    await Community_Post_Attachment.bulkCreate(arrFiles);
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
