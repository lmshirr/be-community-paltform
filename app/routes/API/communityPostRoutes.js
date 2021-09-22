const express = require('express');
const uuid = require('uuid');
const multer = require('multer');
const path = require('path');
const communityPostRouter = express.Router();
const communityPostController = require('../../controllers/communityPostController');
const authorizationMiddleware = require('../../middleware/authorizationMiddleware');
const postMiddleware = require('../../middleware/postMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, 'assets/posts');
  },
  filename: function (req, file, next) {
    next(null, uuid.v4() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

communityPostRouter.get(
  '/posts/:CommunityId',
  communityPostController.getCommunityPosts
);
communityPostRouter.get('/:id', communityPostController.getPostDetails);
communityPostRouter.post(
  '/',
  authorizationMiddleware.checkLogin,
  upload.array('attachments'),
  postMiddleware.checkMembership_post,
  communityPostController.createPost
);
communityPostRouter.patch(
  '/:id',
  authorizationMiddleware.checkLogin,
  upload.array('attachments'),
  postMiddleware.checkUser_delete_patch,
  communityPostController.editPost
);
communityPostRouter.delete(
  '/:id',
  authorizationMiddleware.checkLogin,
  postMiddleware.checkUser_delete_patch,
  communityPostController.deletePost
);
communityPostRouter.delete(
  '/attachment/:id',
  communityPostController.deleteAttachment
);

module.exports = communityPostRouter;
