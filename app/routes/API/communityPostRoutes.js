const express = require('express');
const communityPostController = require('../../controllers/communityPostController');

const communityPostRouter = express.Router();

communityPostRouter.delete(
  '/attachment/:id',
  communityPostController.deleteAttachment
);

module.exports = communityPostRouter;
