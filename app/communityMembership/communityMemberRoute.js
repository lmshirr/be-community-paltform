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
  '/:id/join',
  authorizationMiddleware.checkLogin,
  communityMemberController.joinCommunity
);
communityMemberRouter.get(
  '/:id/memberships',
  authorizationMiddleware.checkLogin,
  communityMiddleware.checkMember,
  communityMemberController.getCommunityMember
);
communityMemberRouter
  .route('/:id/memberships/:userId')
  .patch(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkOwner,
    communityMemberController.updateRole
  );
communityMemberRouter
  .route('/:id/memberships/leave')
  .delete(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    communityMemberController.leaveCommunity
  );

// request join
communityMemberRouter.get(
  '/:id/requests',
  authorizationMiddleware.checkLogin,
  communityMiddleware.checkAdmin,
  communityMemberController.getRequestCommunity
);
communityMemberRouter.patch(
  '/:id/requests/:requestId',
  authorizationMiddleware.checkLogin,
  communityMiddleware.checkAdmin,
  communityMemberController.respondRequest
);

// invitation
communityMemberRouter
  .route('/:id/invitations')
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
  .route('/:id/invitations/:ivitationId')
  .delete(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkAdmin,
    communityMemberController.deleteInvite
  );
