/* eslint-disable no-dupe-keys */
const {
  Community_Post,
  User,
  Community_Post_Attachment,
} = require('../models/index');
const {
  InternalServerException,
  BadRequestException,
  NotFoundException,
} = require('../utils/httpExceptions/index');

module.exports.getCommunityPosts = async function (req, res, next) {
  const { id: community_id } = req.params;

  let post;
  try {
    post = await Community_Post.findAll({
      where: {
        community_id,
      },
      include: [{ model: Community_Post_Attachment }, { model: User }],
      order: [['created_at', 'DESC']],
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({ data: post });
};

module.exports.getPostDetails = async function (req, res, next) {
  const { postId: id } = req.params;

  let post;
  try {
    post = await Community_Post.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'profile_pict'],
        },
        {
          model: Community_Post_Attachment,
          attributes: ['id', 'filename'],
        },
      ],
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({
    data: post,
  });
};

module.exports.createPost = async function (req, res, next) {
  const { id: community_id } = req.params;
  const { content } = req.body;
  const { id: user_id } = req.user;

  try {
    const post = await Community_Post.create({
      community_id,
      user_id,
      content,
    });

    if (req.files) {
      const CommunityPostId = post.id;
      req.files.forEach(async function (file) {
        const { filename } = file;

        const path =
          process.env.NODE_ENV === 'production'
            ? process.env.PRODUCTION_URL
            : process.env.LOCALHOST_URL;

        const file_url = `${path}/assets/post_pict/${filename}`;

        try {
          await Community_Post_Attachment.create({
            community_post_id: CommunityPostId,
            filename: file_url,
          });
        } catch (error) {
          return next(
            new InternalServerException('Internal server error', error)
          );
        }
      });
    }
    res.status(201).json({
      messages: 'Post created',
      data: post,
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return next(
        new BadRequestException(
          'Validation error',
          error.errors.map((e) => {
            return {
              attribute: e.path,
              message: e.message,
            };
          })
        )
      );
    }
    return next(new InternalServerException('Internal server error', error));
  }
};

module.exports.editPost = async function (req, res, next) {
  const { postId: post_id } = req.params;
  const { content } = req.body;

  try {
    const post = await Community_Post.findOne({ where: { id: post_id } });

    if (!post) {
      return next(new NotFoundException('Post not found'));
    }

    post.update({
      content,
    });

    if (req.files) {
      req.files.forEach(async function (file) {
        const { filename } = file;

        try {
          await Community_Post_Attachment.create({
            community_post_id: post_id,
            filename,
          });
        } catch (error) {
          return next(
            new InternalServerException('Internal server error', error)
          );
        }
      });
    }
    return res.status(200).json({
      messages: 'Post updated!',
      data: post,
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }
};

module.exports.deletePost = async function (req, res, next) {
  const { postId: post_id } = req.params;

  let post;
  try {
    post = await Community_Post.destroy({ where: { id: post_id } });

    if (!post) {
      return next(new NotFoundException('Post not found'));
    }
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({
    messages: 'Delete success!',
  });
};

module.exports.deleteAttachment = async function (req, res, next) {
  const { id } = req.params;

  try {
    await Community_Post_Attachment.destroy({ where: { id } });

    return res.json({
      success: true,
      messages: 'Delete success!',
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }
};
