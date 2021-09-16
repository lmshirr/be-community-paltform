const express = require('express');
const commentController = require('../../controllers/commentController');
const commentRouter = express.Router();
const authorizationMiddleware = require('../../middleware/authorizationMiddleware');
const classMiddleware = require('../../middleware/classMiddleware');

commentRouter
  .route('/')
  .post(
    authorizationMiddleware.checkLogin,
    classMiddleware.checkMembership,
    commentController.postComment
  )
  .get(
    authorizationMiddleware.checkLogin,
    classMiddleware.checkMembership,
    commentController.getComments
  );

module.exports = commentRouter;
