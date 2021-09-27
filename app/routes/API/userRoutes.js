const express = require('express');
const userController = require('../../controllers/userController');
const googleAuthController = require('../../controllers/googleAuthController');
const authorizationMiddleware = require('../../middleware/authorizationMiddleware');
const {
  uploadProfileImage,
} = require('../../utils/multer/uploadImage.service');

const userRouter = express.Router();

userRouter.get('/search/:key', userController.findUser);
userRouter.get('/verify', userController.verification);
userRouter
  .route('/:id')
  .get(userController.getUserDetail)
  .patch(
    authorizationMiddleware.checkLogin,
    uploadProfileImage.single('profile_pict'),
    userController.editUser
  );
userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.post('/logout', userController.logout);

// invitation
userRouter.get(
  '/invitation',
  authorizationMiddleware.checkLogin,
  userController.getInvitationUser
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
  userController.getAllUserCommunity
);

// Google OAuth
userRouter.get('/auth/google', googleAuthController.googleLogin);
userRouter.get('/auth/google/url', googleAuthController.getGoogleAuthURL);
userRouter.get('/auth/google/user', googleAuthController.getCurrentUser);

module.exports = userRouter;
