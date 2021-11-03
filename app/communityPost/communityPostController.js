const communityPostService = require('./communityPostService');

async function getCommunityPosts(req, res, next) {
  const { communityId } = req.params;

  let post;
  try {
    post = await communityPostService.getPostInCommunity(communityId);
  } catch (error) {
    return next(error);
  }

  return res.json({ data: post });
}

async function getPostDetails(req, res, next) {
  const { postId } = req.params;

  let post;

  try {
    post = await communityPostService.getPostDetail(postId);
  } catch (error) {
    return next(error);
  }

  return res.json({
    data: post,
  });
}

async function createPost(req, res, next) {
  const { communityId: community_id } = req.params;
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
}

async function editPost(req, res, next) {
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
}

async function deletePost(req, res, next) {
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
}

async function deleteAttachment(req, res, next) {
  const { communityId } = req.params;

  let community_post_attachment;

  try {
    community_post_attachment = await communityPostService.deleteAttachment(
      communityId
    );
  } catch (error) {
    return next(error);
  }

  return res.json({
    success: true,
    messages: 'Delete success!',
    community_post_attachment,
  });
}

module.exports = {
  getCommunityPosts,
  editPost,
  deletePost,
  deleteAttachment,
  createPost,
  getPostDetails,
};
