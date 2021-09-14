const express = require('express');
const uuid = require('uuid');
const multer = require('multer');
const path = require('path');
const communityRouter = express.Router();
const memberController = require('../../controllers/communityMemberController');
const communityController = require('../../controllers/communityController');
const requestController = require('../../controllers/requestMembershipController');
const invitationController = require('../../controllers/invitationController');
const authorizationMiddleware = require('../../middleware/authorizationMiddleware');
const invitationMiddleware = require('../../middleware/invitationMiddleware');
const requestMembershipMiddleware = require('../../middleware/requestMemberMiddleware');
const storage = multer.diskStorage({
    destination: function(req, file, next){
        next(null, 'assets/community_pict');
    },
    filename: function(req, file, next){
        next(null, uuid.v4() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, next)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        next(null, true);
    }else{
        next(new Error('Please only upload jpeg, jpg, and png'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

communityRouter.get('/search/:key', communityController.findCommunity);
communityRouter.get('/:id', communityController.getCommunityDetails);
communityRouter.post('/', upload.single('community_pict'), communityController.createCommunity);
communityRouter.patch('/:id', authorizationMiddleware.checkLogin, authorizationMiddleware.checkAdmin, upload.single('community_pict'), communityController.editCommunity);
communityRouter.delete('/:id', authorizationMiddleware.checkLogin, authorizationMiddleware.checkOwner, communityController.deleteCommunity);

// Membership
communityRouter.post('/join', authorizationMiddleware.checkLogin, memberController.joinCommunity);
communityRouter.patch('/updateRole/:id/:UserId', authorizationMiddleware.checkLogin, authorizationMiddleware.checkOwner, memberController.updateRole);
communityRouter.patch('/changeOwner/:id', authorizationMiddleware.checkLogin, authorizationMiddleware.checkOwner, memberController.changeOwner);
communityRouter.delete('/leaveCommunity/:id', authorizationMiddleware.checkLogin, memberController.leaveCommunity);

//request join
communityRouter.get('/request/user/', authorizationMiddleware.checkLogin, requestController.getRequestUser);
communityRouter.get('/request/:CommunityId', authorizationMiddleware.checkLogin, requestMembershipMiddleware.checkAdmin, requestController.getRequestCommunity);
communityRouter.patch('/:CommunityId/request/:id', authorizationMiddleware.checkLogin, requestMembershipMiddleware.checkAdmin, requestController.respondRequest);
communityRouter.delete('/request/:id', authorizationMiddleware.checkLogin, requestMembershipMiddleware.checkUser, requestController.deleteRequest);

//invitation
communityRouter.get('/invitation/user/', authorizationMiddleware.checkLogin, invitationController.getInvitationUser);
communityRouter.get('/invitation/:CommunityId', authorizationMiddleware.checkLogin, invitationMiddleware.checkAdmin, invitationController.getInvitationCommunity);
communityRouter.post('/invitation/', authorizationMiddleware.checkLogin, invitationMiddleware.checkMembership, invitationController.createInvitation);
communityRouter.patch('/invitation/:id', authorizationMiddleware.checkLogin, invitationMiddleware.checkUser, invitationController.respondInvite);
communityRouter.delete('/invitation/:id', authorizationMiddleware.checkLogin, invitationMiddleware.checkAdmin, invitationController.deleteInvite);
module.exports = communityRouter;