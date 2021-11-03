const { Router } = require('express');
const authorizationMiddleware = require('../shared/middleware/authorizationMiddleware');
const communityMiddleware = require('../community/communityMiddleware');
const { uploadImageMiddleware } = require('../shared/utils/cloudStorage');
const commentController = require('./commentController');
const {
  commentBodySchemas,
  commentParamSchemas,
} = require('./commentValidation');
const { usePipes } = require('../shared/middleware/pipesMiddleware');

const commentRouter = Router({ mergeParams: true });

/**
 * base route /communities
 */
commentRouter
  .route('/:communityId/posts/:postId/comments')
  .get(
    usePipes(commentParamSchemas.communityIdPostId, 'params'),
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    commentController.getComments
  )
  .post(
    usePipes(commentParamSchemas.communityIdPostId, 'params'),
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    uploadImageMiddleware.single('comment_pict'),
    usePipes(commentBodySchemas.createComment, 'body'),
    commentController.postComment
  );
commentRouter
  .route('/:communityId/posts/:postId/comments/:commentId')
  .delete(
    usePipes(commentParamSchemas.communityIdPostIdCommentId, 'params'),
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkPostOwner,
    commentController.deleteComment
  );

module.exports = commentRouter;
