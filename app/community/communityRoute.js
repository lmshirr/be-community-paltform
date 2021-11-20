const express = require('express');
const communityController = require('./communityController');
const authorizationMiddleware = require('../shared/middleware/authorizationMiddleware');
const classController = require('../class/classController');
const communityMiddleware = require('./communityMiddleware');
const { uploadImageMiddleware } = require('../shared/utils/cloudStorage');
const { usePipes } = require('../shared/middleware/pipesMiddleware');
const {
  communityParamSchemas,
  communityBodySchemas,
  communityQuerySchemas,
} = require('./communityValidation');

const communityRouter = express.Router();

/**
 * Base route /communities
 */

communityRouter.get('/search/:key', communityController.findCommunity);
communityRouter
  .route('/')
  .get(
    usePipes(communityQuerySchemas.getCommunities, 'query'),
    authorizationMiddleware.checkLogin,
    communityController.getCommunities
  )
  .post(
    authorizationMiddleware.checkLogin,
    uploadImageMiddleware.single('community_pict'),
    usePipes(communityBodySchemas.createCommunity, 'body'),
    communityController.createCommunity
  );
communityRouter
  .route('/:communityId')
  .get(
    usePipes(communityParamSchemas.communityId, 'params'),
    authorizationMiddleware.checkLogin,
    communityController.getCommunityDetails
  )
  .patch(
    usePipes(communityParamSchemas.communityId, 'params'),
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkAdmin,
    uploadImageMiddleware.fields([
      { name: 'community_pict' },
      { name: 'community_banner' },
    ]),
    usePipes(communityBodySchemas.editCommunity, 'body'),
    communityController.editCommunity
  )
  .delete(
    usePipes(communityParamSchemas.communityId, 'params'),
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkOwner,
    communityController.deleteCommunity
  );

// classes
communityRouter
  .route('/:communityId/classes')
  .post(
    usePipes(communityParamSchemas.communityId, 'params'),
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
  .route('/:communityId/classes/search')
  .get(
    usePipes(communityParamSchemas.communityId, 'params'),
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    classController.findClass
  );

communityRouter.get(
  '/:communityId/checkmember/:userId',
  usePipes(communityParamSchemas.communityIdUserId, 'params'),
  authorizationMiddleware.checkLogin,
  communityController.checkMember
);

module.exports = communityRouter;
