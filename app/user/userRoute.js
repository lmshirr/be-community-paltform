const express = require('express');
const userController = require('./userController');
const authorizationMiddleware = require('../shared/middleware/authorizationMiddleware');
const { communityMemberController } = require('../communityMembership');
const { uploadImageMiddleware } = require('../shared/utils/cloudStorage');

const userRouter = express.Router();

userRouter.get('/search/:key', userController.findUser);
userRouter.get('/verify', userController.verification);
userRouter
  .route('/:id')
  .get(userController.getUserDetail)
  .patch(
    authorizationMiddleware.checkLogin,
    uploadImageMiddleware.single('profile_pict'),
    userController.editUser
  );
userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.post('/logout', userController.logout);

// invitation
userRouter.get(
  '/invitations',
  authorizationMiddleware.checkLogin,
  userController.getInvitationUser
);
userRouter
  .route('/invitations/:invitationId')
  .patch(
    authorizationMiddleware.checkLogin,
    communityMemberController.respondInvite
  );

// request
userRouter.get(
  '/request',
  authorizationMiddleware.checkLogin,
  userController.getRequestUser
);
userRouter.delete(
  '/request/:id',
  authorizationMiddleware.checkLogin,
  userController.deleteUserRequest
);

// community
userRouter.get(
  '/:id/communities',
  authorizationMiddleware.checkLogin,
  userController.getAllUserCommunityJoinOrNot
);

// Google OAuth
userRouter.get('/auth/google', userController.googleLogin);
userRouter.get('/auth/google/url', userController.getGoogleAuthURL);
userRouter.get('/auth/google/user', userController.getCurrentUser);

// Test only
userRouter.post('/auth/signup', userController.testSignup);

module.exports = userRouter;
