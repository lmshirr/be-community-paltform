const { Router } = require('express');
const authorizationMiddleware = require('../shared/middleware/authorizationMiddleware');
const communityMiddleware = require('../community/communityMiddleware');
const { uploadImageMiddleware } = require('../shared/utils/cloudStorage');
const commentController = require('./commentController');

const commentRouter = Router({ mergeParams: true });

// base route communities
commentRouter
  .route('/:id/posts/:postId/comments')
  .get(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    commentController.getComments
  )
  .post(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    uploadImageMiddleware.single('comment_pict'),
    commentController.postComment
  );
commentRouter
  .route('/:id/posts/:postId/comments/:commentId')
  .delete(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkPostOwner,
    commentController.deleteComment
  );

module.exports = commentRouter;
