const express = require('express');
const uuid = require('uuid');
const multer = require('multer');
const path = require('path');
const userController = require('../../controllers/userController');
const googleAuthController = require('../../controllers/googleAuthController');
const authorizationMiddleware = require('../../middleware/authorizationMiddleware');

const userRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, 'assets/profile_pict');
  },
  filename: (req, file, next) => {
    next(null, uuid.v4() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, next) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    next(null, true);
  } else {
    next(new Error('Please only upload jpeg, jpg, and png'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

userRouter.get('/search/:key', userController.findUser);
userRouter.get('/verify', userController.verification);
userRouter
  .route('/:id')
  .get(userController.getUserDetail)
  .patch(
    authorizationMiddleware.checkLogin,
    upload.single('profile_pict'),
    userController.editUser
  );
userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.post('/logout', userController.logout);

// Google OAuth
userRouter.get('/auth/google', googleAuthController.googleLogin);
userRouter.get('/auth/google/url', googleAuthController.getGoogleAuthURL);

module.exports = userRouter;
