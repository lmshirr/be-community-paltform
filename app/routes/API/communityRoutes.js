const express = require('express');
const {
  uploadCommunityImage,
  uploadClassImage,
} = require('../../utils/multer/uploadImage.service');
const memberController = require('../../controllers/communityMemberController');
const communityController = require('../../controllers/communityController');
const requestController = require('../../controllers/requestMembershipController');
const invitationController = require('../../controllers/invitationController');
const authorizationMiddleware = require('../../middleware/authorizationMiddleware');
const communityPostController = require('../../controllers/communityPostController');
const {
  uploadPostImage,
  uploadCommentImage,
} = require('../../utils/multer/uploadImage.service');
const classController = require('../../controllers/classController');
const commentController = require('../../controllers/commentController');
const communityMiddleware = require('../../middleware/communityMiddleware');

const communityRouter = express.Router();

communityRouter.get('/search/:key', communityController.findCommunity);
communityRouter
  .route('/')
  .get(authorizationMiddleware.checkLogin, communityController.getAllCommunity)
  .post(
    authorizationMiddleware.checkLogin,
    uploadCommunityImage.single('community_pict'),
    communityController.createCommunity
  );
communityRouter
  .route('/:id')
  .get(
    authorizationMiddleware.checkLogin,
    communityController.getCommunityDetails
  )
  .patch(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkAdmin,
    uploadCommunityImage.fields([
      { name: 'community_pict' },
      { name: 'community_banner' },
    ]),
    communityController.editCommunity
  )
  .delete(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkOwner,
    communityController.deleteCommunity
  );

// Membership
communityRouter.post(
  '/:id/join',
  authorizationMiddleware.checkLogin,
  memberController.joinCommunity
);
communityRouter.get(
  '/:id/memberships',
  authorizationMiddleware.checkLogin,
  communityMiddleware.checkMember,
  memberController.getCommunityMember
);
communityRouter
  .route('/:id/memberships/:userId')
  .patch(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkOwner,
    memberController.updateRole
  );
communityRouter
  .route('/:id/memberships/leave')
  .delete(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    memberController.leaveCommunity
  );

// request join
communityRouter.get(
  '/:id/requests',
  authorizationMiddleware.checkLogin,
  communityMiddleware.checkAdmin,
  requestController.getRequestCommunity
);
communityRouter.patch(
  '/:id/requests/:requestId',
  authorizationMiddleware.checkLogin,
  communityMiddleware.checkAdmin,
  requestController.respondRequest
);

// invitation
communityRouter
  .route('/:id/invitations')
  .get(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkAdmin,
    invitationController.getInvitationCommunity
  )
  .post(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    invitationController.createInvitation
  );

communityRouter
  .route('/:id/invitations/:ivitationId')
  .delete(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkAdmin,
    invitationController.deleteInvite
  );

// post routes
communityRouter
  .route('/:id/posts')
  .get(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    communityPostController.getCommunityPosts
  )
  .post(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    uploadPostImage.array('attachments'),
    communityPostController.createPost
  );

communityRouter
  .route('/:id/posts/:postId')
  .get(
    authorizationMiddleware.checkLogin,
    communityPostController.getPostDetails
  )
  .patch(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkPostOwner,
    uploadPostImage.array('attachments'),
    communityPostController.editPost
  )
  .delete(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkPostOwner,
    communityPostController.deletePost
  );

// comments
communityRouter
  .route('/:id/posts/:postId/comments')
  .get(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    commentController.getComments
  )
  .post(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    uploadCommentImage.single('comment_pict'),
    commentController.postComment
  );
communityRouter
  .route('/:id/posts/:postId/comments/:commentId')
  .delete(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkPostOwner,
    commentController.deleteComment
  );

// classes
communityRouter
  .route('/:id/classes')
  .post(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkAdmin,
    uploadClassImage.single('class_banner'),
    classController.createClass
  )
  .get(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    classController.getClassInCommunity
  );

communityRouter
  .route('/:id/classes/search')
  .get(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    classController.findClass
  );

module.exports = communityRouter;
