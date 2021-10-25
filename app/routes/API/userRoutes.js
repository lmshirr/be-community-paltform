const express = require('express');
const userController = require('../../controllers/userController');
const googleAuthController = require('../../controllers/googleAuthController');
const authorizationMiddleware = require('../../middleware/authorizationMiddleware');
const invitationController = require('../../controllers/invitationController');
const { uploadImageMiddleware } = require('../../utils/uploadFile');

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
    invitationController.respondInvite
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
userRouter.get('/auth/google', googleAuthController.googleLogin);
userRouter.get('/auth/google/url', googleAuthController.getGoogleAuthURL);
userRouter.get('/auth/google/user', googleAuthController.getCurrentUser);

module.exports = userRouter;
