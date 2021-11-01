const express = require('express');
const communityController = require('./communityController');
const authorizationMiddleware = require('../shared/middleware/authorizationMiddleware');
const classController = require('../class/classController');
const communityMiddleware = require('./communityMiddleware');
const { uploadImageMiddleware } = require('../utils/uploadFile');

const communityRouter = express.Router();

communityRouter.get('/search/:key', communityController.findCommunity);
communityRouter
  .route('/')
  .get(authorizationMiddleware.checkLogin, communityController.getAllCommunity)
  .post(
    authorizationMiddleware.checkLogin,
    uploadImageMiddleware.single('community_pict'),
    communityController.createCommunity
  );
communityRouter
  .route('/:id')
  .get(
    authorizationMiddleware.checkLogin,
    communityController.getCommunityDetails
  )
  .patch(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkAdmin,
    uploadImageMiddleware.fields([
      { name: 'community_pict' },
      { name: 'community_banner' },
    ]),
    communityController.editCommunity
  )
  .delete(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkOwner,
    communityController.deleteCommunity
  );

// classes
communityRouter
  .route('/:id/classes')
  .post(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkAdmin,
    uploadImageMiddleware.single('class_banner'),
    classController.createClass
  )
  .get(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    classController.getClassInCommunity
  );

communityRouter
  .route('/:id/classes/search')
  .get(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    classController.findClass
  );

module.exports = communityRouter;
