const { Router } = require('express');
const authorizationMiddleware = require('../shared/middleware/authorizationMiddleware');
const communityMemberController = require('./communityMemberController');
const { communityMiddleware } = require('../community');

const communityMemberRouter = Router({ mergeParams: true });

/**
 * base route /communities
 */

// Membership
communityMemberRouter.post(
  '/:communityId/join',
  authorizationMiddleware.checkLogin,
  communityMemberController.joinCommunity
);
communityMemberRouter.get(
  '/:communityId/memberships',
  authorizationMiddleware.checkLogin,
  communityMiddleware.checkMember,
  communityMemberController.getCommunityMember
);
communityMemberRouter
  .route('/:communityId/memberships/:userId')
  .patch(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkOwner,
    communityMemberController.updateRole
  );
communityMemberRouter
  .route('/:communityId/memberships/leave')
  .delete(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    communityMemberController.leaveCommunity
  );

// request join
communityMemberRouter.get(
  '/:communityId/requests',
  authorizationMiddleware.checkLogin,
  communityMiddleware.checkAdmin,
  communityMemberController.getRequestCommunity
);
communityMemberRouter.patch(
  '/:communityId/requests/:requestId',
  authorizationMiddleware.checkLogin,
  communityMiddleware.checkAdmin,
  communityMemberController.respondRequest
);

// invitation
communityMemberRouter
  .route('/:communityId/invitations')
  .get(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkAdmin,
    communityMemberController.getInvitationCommunity
  )
  .post(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    communityMemberController.createInvitation
  );

communityMemberRouter
  .route('/:communityId/invitations/:ivitationId')
  .delete(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkAdmin,
    communityMemberController.deleteInvite
  );
