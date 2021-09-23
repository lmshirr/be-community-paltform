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
communityRouter.patch(
  '/:id/members/:memberId',
  authorizationMiddleware.checkLogin,
  authorizationMiddleware.checkOwner,
  memberController.updateRole
);
communityRouter.delete(
  '/:id/members/:memberId',
  authorizationMiddleware.checkLogin,
  memberController.leaveCommunity
);

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
communityRouter.get('/:id/posts', communityPostController.getCommunityPosts);
communityRouter.post(
  '/:id/posts',
  authorizationMiddleware.checkLogin,
  uploadPostImage.array('attachments'),
  postMiddleware.checkMembership_post,
  communityPostController.createPost
);
communityRouter.patch(
  '/:id/posts/:postId',
  authorizationMiddleware.checkLogin,
  uploadPostImage.array('attachments'),
  postMiddleware.checkUser_delete_patch,
  communityPostController.editPost
);
communityRouter.delete(
  '/:id/posts/:postId',
  authorizationMiddleware.checkLogin,
  postMiddleware.checkUser_delete_patch,
  communityPostController.deletePost
);
communityRouter.get(
  '/:id/posts/:postId',
  communityPostController.getPostDetails
);

module.exports = communityRouter;
