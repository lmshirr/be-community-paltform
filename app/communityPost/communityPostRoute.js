const express = require('express');
const communityPostController = require('./communityPostController');
const authorizationMiddleware = require('../shared/middleware/authorizationMiddleware');
const { communityMiddleware } = require('../community');
const { uploadImageMiddleware } = require('../shared/utils/cloudStorage');

const communityPostRouter = express.Router({ mergeParams: true });

communityPostRouter.delete(
  '/attachment/:id',
  communityPostController.deleteAttachment
);

/**
 * base route /communities
 */

// post routes
communityPostRouter
  .route('/:id/posts')
  .get(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    communityPostController.getCommunityPosts
  )
  .post(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    uploadImageMiddleware.array('attachments'),
    communityPostController.createPost
  );

communityPostRouter
  .route('/:id/posts/:postId')
  .get(
    authorizationMiddleware.checkLogin,
    communityPostController.getPostDetails
  )
  .patch(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkPostOwner,
    uploadImageMiddleware.array('attachments'),
    communityPostController.editPost
  )
  .delete(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkPostOwner,
    communityPostController.deletePost
  );

module.exports = communityPostRouter;
