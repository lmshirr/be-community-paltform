const { Router } = require('express');
const commentController = require('../../controllers/commentController');
const authorizationMiddleware = require('../../middleware/authorizationMiddleware');
const {
  uploadCommentImage,
} = require('../../utils/multer/uploadImage.service');
const commentMiddleware = require('../../middleware/commentMiddleware');

const commentRouter = Router();

commentRouter
  .route('/')
  .post(
    authorizationMiddleware.checkLogin,
    commentMiddleware.checkMembership,
    uploadCommentImage.single('comment_pict'),
    commentController.postComment
  )
  .get(
    authorizationMiddleware.checkLogin,
    commentMiddleware.checkMembership,
    commentController.getComments
  )
  .delete();

module.exports = commentRouter;
