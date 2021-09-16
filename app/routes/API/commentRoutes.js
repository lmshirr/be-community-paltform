const express = require("express");
const commentController = require("../../controllers/commentController");
const commentRouter = express.Router();

commentRouter.route("/").post(commentController.postComment).get(commentController.getComments);

module.exports = commentRouter;
