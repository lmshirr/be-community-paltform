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
const requestMembershipMiddleware = require('../../middleware/requestMemberMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');

const communityRouter = express.Router();

communityRouter.get('/search/:key', communityController.findCommunity);
communityRouter
  .route('/')
  .get(communityController.getCommunityDetails)
  .post(
    authorizationMiddleware.checkLogin,
    uploadCommunityImage.single('community_pict'),
    communityController.createCommunity
  )
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
  '/join',
  authorizationMiddleware.checkLogin,
  memberController.joinCommunity
);
communityRouter.patch(
  '/member/role',
  authorizationMiddleware.checkLogin,
  authorizationMiddleware.checkOwner,
  memberController.updateRole
);
communityRouter.patch(
  '/member/owner',
  authorizationMiddleware.checkLogin,
  authorizationMiddleware.checkOwner,
  memberController.changeOwner
);
communityRouter.delete(
  '/leave',
  authorizationMiddleware.checkLogin,
  memberController.leaveCommunity
);

// request join
communityRouter.get(
  '/request/user',
  authorizationMiddleware.checkLogin,
  requestController.getRequestUser
);
communityRouter.get(
  '/request',
  authorizationMiddleware.checkLogin,
  requestMembershipMiddleware.checkAdmin,
  requestController.getRequestCommunity
);
communityRouter.patch(
  '/request',
  authorizationMiddleware.checkLogin,
  requestMembershipMiddleware.checkAdmin,
  requestController.respondRequest
);
communityRouter.delete(
  '/request',
  authorizationMiddleware.checkLogin,
  requestController.deleteRequest
);

// invitation
communityRouter.get(
  '/invitation/user',
  authorizationMiddleware.checkLogin,
  invitationController.getInvitationUser
);
communityRouter.get(
  '/invitation',
  authorizationMiddleware.checkLogin,
  invitationMiddleware.checkAdmin,
  invitationController.getInvitationCommunity
);
communityRouter.post(
  '/invitation',
  authorizationMiddleware.checkLogin,
  roleMiddleware.checkMembership,
  invitationController.createInvitation
);
communityRouter.patch(
  '/invitation/:id',
  authorizationMiddleware.checkLogin,
  invitationMiddleware.checkUser,
  invitationController.respondInvite
);
communityRouter.delete(
  '/invitation/:id',
  authorizationMiddleware.checkLogin,
  invitationMiddleware.checkAdmin,
  invitationController.deleteInvite
);

module.exports = communityRouter;
