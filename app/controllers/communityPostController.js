const communityPostService = require('../services/communityPostService');

module.exports.getCommunityPosts = async function (req, res, next) {
  const { id } = req.params;

  let post;
  try {
    post = await communityPostService.getPostInCommunity(id);
  } catch (error) {
    return next(error);
  }

  return res.json({ data: post });
};

module.exports.getPostDetails = async function (req, res, next) {
  const { postId: id } = req.params;

  let post;

  try {
    post = await communityPostService.getPostDetail(id);
  } catch (error) {
    return next(error);
  }

  return res.json({
    data: post,
  });
};

module.exports.createPost = async function (req, res, next) {
  const { id: community_id } = req.params;
  const { content } = req.body;
  const { id: member_id } = req.member;
  const { files } = req;

  let post;

  try {
    post = await communityPostService.createPost(
      { community_id, member_id, content },
      files
    );
  } catch (error) {
    return next(error);
  }

  res.status(201).json({
    messages: 'Post created',
    data: post,
  });
};

module.exports.editPost = async function (req, res, next) {
  const { postId } = req.params;
  const { content } = req.body;
  const { files } = req;

  let post;

  try {
    post = await communityPostService.editPost({ content }, postId, files);
  } catch (error) {
    return next(error);
  }

  return res.json({
    messages: 'Post updated!',
    data: post,
  });
};

module.exports.deletePost = async function (req, res, next) {
  const { postId } = req.params;

  let post;
  try {
    post = await communityPostService.deletePost(postId);
  } catch (error) {
    return next(error);
  }

  return res.json({
    messages: 'Delete success!',
    post,
  });
};

module.exports.deleteAttachment = async function (req, res, next) {
  const { id } = req.params;

  let community_post_attachment;

  try {
    community_post_attachment = await communityPostService.deleteAttachment(id);
  } catch (error) {
    return next(error);
  }

  return res.json({
    success: true,
    messages: 'Delete success!',
    community_post_attachment,
  });
};
