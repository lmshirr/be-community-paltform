const express = require('express');
const {
  uploadCommunityImage,
} = require('../../utils/multer/uploadImage.service');
const memberController = require('../../controllers/communityMemberController');
const communityController = require('../../controllers/communityController');
const requestController = require('../../controllers/requestMembershipController');
const invitationController = require('../../controllers/invitationController');
const authorizationMiddleware = require('../../middleware/authorizationMiddleware');
const invitationMiddleware = require('../../middleware/invitationMiddleware');
const communityPostController = require('../../controllers/communityPostController');
const roleMiddleware = require('../../middleware/roleMiddleware');
const { uploadPostImage } = require('../../utils/multer/uploadImage.service');
const postMiddleware = require('../../middleware/postMiddleware');
const classController = require('../../controllers/classController');
const commentMiddleware = require('../../middleware/commentMiddleware');
const commentController = require('../../controllers/commentController');
const {
  uploadCommentImage,
} = require('../../utils/multer/uploadImage.service');

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
  .get(communityController.getCommunityDetails)
  .patch(
    authorizationMiddleware.checkLogin,
    authorizationMiddleware.checkAdmin,
    uploadCommunityImage.single('community_pict'),
    communityController.editCommunity
  )
  .delete(
    authorizationMiddleware.checkLogin,
    authorizationMiddleware.checkOwner,
    communityController.deleteCommunity
  );

// Membership
communityRouter.post(
  '/:id/join',
  authorizationMiddleware.checkLogin,
  memberController.joinCommunity
);
communityRouter
  .route('/:id/memberships/:memberId')
  .patch(
    authorizationMiddleware.checkLogin,
    authorizationMiddleware.checkOwner,
    memberController.updateRole
  )
  .delete(authorizationMiddleware.checkLogin, memberController.leaveCommunity);

// request join
communityRouter.get(
  '/:id/requests',
  authorizationMiddleware.checkLogin,
  authorizationMiddleware.checkAdmin,
  requestController.getRequestCommunity
);
communityRouter.patch(
  '/:id/requests/:requestId',
  authorizationMiddleware.checkLogin,
  authorizationMiddleware.checkAdmin,
  requestController.respondRequest
);

// invitation
communityRouter
  .route('/:id/invitations')
  .get(
    authorizationMiddleware.checkLogin,
    authorizationMiddleware.checkAdmin,
    invitationController.getInvitationCommunity
  )
  .post(
    authorizationMiddleware.checkLogin,
    roleMiddleware.checkMembership,
    invitationController.createInvitation
  );

communityRouter
  .route('/:id/invitations/:ivitationId')
  .patch(
    authorizationMiddleware.checkLogin,
    invitationMiddleware.checkUser,
    invitationController.respondInvite
  )
  .delete(
    authorizationMiddleware.checkLogin,
    invitationMiddleware.checkAdmin,
    invitationController.deleteInvite
  );

// post routes
communityRouter
  .route('/:id/posts')
  .get(communityPostController.getCommunityPosts)
  .post(
    authorizationMiddleware.checkLogin,
    uploadPostImage.array('attachments'),
    postMiddleware.checkMembership_post,
    communityPostController.createPost
  );

communityRouter
  .route('/:id/posts/:postId')
  .get(communityPostController.getPostDetails)
  .patch(
    authorizationMiddleware.checkLogin,
    uploadPostImage.array('attachments'),
    postMiddleware.checkUser_delete_patch,
    communityPostController.editPost
  )
  .delete(
    authorizationMiddleware.checkLogin,
    postMiddleware.checkUser_delete_patch,
    communityPostController.deletePost
  );

// comments
communityRouter
  .route('/:id/posts/:postId/comments')
  .get(
    authorizationMiddleware.checkLogin,
    commentMiddleware.checkMembership,
    commentController.getComments
  )
  .post(
    authorizationMiddleware.checkLogin,
    commentMiddleware.checkMembership,
    uploadCommentImage.single('comment_pict'),
    commentController.postComment
  );
communityRouter
  .route('/:id/posts/:postId/comments/:commentId')
  .delete(
    authorizationMiddleware.checkLogin,
    commentMiddleware.checkOwnPost,
    commentController.deleteComment
  );

// classes
communityRouter
  .route('/:id/classes')
  .post(authorizationMiddleware.checkLogin, classController.createClass);

module.exports = communityRouter;
