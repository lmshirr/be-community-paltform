const express = require('express');
const communityPostController = require('./communityPostController');
const authorizationMiddleware = require('../shared/middleware/authorizationMiddleware');
const { communityMiddleware } = require('../community');
const { uploadImageMiddleware } = require('../shared/utils/cloudStorage');
const { usePipes } = require('../shared/middleware/pipesMiddleware');
const {
  communityPostParamSchemas,
  communityPostBodySchemas,
} = require('./communityPostValidation');

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
  .route('/:communityId/posts')
  .get(
    usePipes(communityPostParamSchemas.communityId, 'params'),
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    communityPostController.getCommunityPosts
  )
  .post(
    usePipes(communityPostParamSchemas.communityId, 'params'),
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    uploadImageMiddleware.array('attachments'),
    usePipes(communityPostBodySchemas.createPost, 'body'),
    communityPostController.createPost
  );

communityPostRouter
  .route('/:communityId/posts/:postId')
  .get(
    usePipes(communityPostParamSchemas.communityIdPostId, 'params'),
    authorizationMiddleware.checkLogin,
    communityPostController.getPostDetails
  )
  .patch(
    usePipes(communityPostParamSchemas.communityIdPostId, 'params'),
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkPostOwner,
    uploadImageMiddleware.array('attachments'),
    usePipes(communityPostBodySchemas.editPost, 'body'),
    communityPostController.editPost
  )
  .delete(
    usePipes(communityPostParamSchemas.communityIdPostId, 'params'),
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkPostOwner,
    communityPostController.deletePost
  );

module.exports = communityPostRouter;
