const {
  Community_Post,
  User,
  Community_Member,
  Community_Post_Attachment,
} = require('../models/index');
const {
  InternalServerException,
  BadRequestException,
  NotFoundException,
} = require('../utils/httpExceptions');

/**
 *
 * @param {{community_id: string, member_id: string, content: string}} createPostDto
 * @param {object} files
 * @returns {object} post
 */
const createPost = async (createPostDto, files) => {
  let post;

  try {
    post = await Community_Post.create(createPostDto);

    const { id: postId } = post.dataValues;

    if (files) {
      files.forEach(async (file) => {
        const { filename } = file;

        const path =
          process.env.NODE_ENV === 'production'
            ? process.env.PRODUCTION_URL
            : process.env.LOCALHOST_URL;

        const file_url = `${path}/assets/post_pict/${filename}`;

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
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      throw new BadRequestException(
        'Validation error',
        error.errors.map((e) => {
          return {
            attribute: e.path,
            message: e.message,
          };
        })
      );
    }
    throw new InternalServerException('Internal server error', error);
  }

  return post;
};

/**
 *
 * @param {string} id post id
 * @returns post
 */
const getPostDetail = async (id) => {
  let post;

  try {
    post = await Community_Post.findOne({
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
  } catch (error) {
    throw new InternalServerException('Internal server error');
  }

  return post;
};

/**
 *
 * @param {string} communityId
 * @returns post
 */
const getPostInCommunity = async (community_id) => {
  let post;

  try {
    post = await Community_Post.findAll({
      where: {
        community_id,
      },
      include: [
        { model: Community_Post_Attachment },
        { model: Community_Member, include: User },
      ],
      order: [['created_at', 'DESC']],
    });
  } catch (error) {
    throw new InternalServerException('Internal server error');
  }

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

  try {
    post = await Community_Post.findOne({ where: { id: post_id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post = await post.update(editPostDto);

    if (files) {
      files.forEach(async (file) => {
        const { filename } = file;

        const path =
          process.env.NODE_ENV === 'production'
            ? process.env.PRODUCTION_URL
            : process.env.LOCALHOST_URL;

        const file_url = `${path}/assets/post_pict/${filename}`;

        await Community_Post_Attachment.create({
          community_post_id: post_id,
          filename: file_url,
        });
      });
    }
  } catch (error) {
    throw new InternalServerException('Internal server error', error);
  }

  return post;
};

/**
 *
 * @param {string} id
 * @returns post
 */
const deletePost = async (id) => {
  let post;

  try {
    post = await Community_Post.destroy({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }
  } catch (error) {
    throw new InternalServerException('Internal server error', error);
  }

  return post;
};

/**
 *
 * @param {string} id
 * @returns community_post_attachment
 */
const deleteAttachment = async (id) => {
  let community_post_attachment;

  try {
    community_post_attachment = await Community_Post_Attachment.destroy({
      where: { id },
    });
  } catch (error) {
    throw new InternalServerException('Internal server error', error);
  }

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
