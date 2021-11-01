const express = require('express');
const {
  uploadCommunityImage,
  uploadClassImage,
} = require('../../utils/multer/uploadImage.service');
const memberController = require('../../controllers/communityMemberController');
const communityController = require('../../controllers/communityController');
const requestController = require('../../controllers/requestMembershipController');
const invitationController = require('../../controllers/invitationController');
const authorizationMiddleware = require('../../middleware/authorizationMiddleware');
const communityPostController = require('../../controllers/communityPostController');
const { uploadPostImage } = require('../../utils/multer/uploadImage.service');
const classController = require('../../controllers/classController');
const commentController = require('../../controllers/commentController');
const assessmentController = require('../../controllers/assessmentController');
const attemptController = require('../../controllers/attemptController');
const {
  uploadCommentImage,
} = require('../../utils/multer/uploadImage.service');
const communityMiddleware = require('../../middleware/communityMiddleware');
const classMiddleware = require('../../middleware/classMiddleware');

const communityRouter = express.Router();

communityRouter.get('/search/:key', communityController.findCommunity);
communityRouter
  .route('/')
  .get(authorizationMiddleware.checkLogin, communityController.getAllCommunity)
  .post(
    authorizationMiddleware.checkLogin,
    uploadCommunityImage.single('community_pict'),
    communityController.createCommunity
  );
communityRouter
  .route('/:id')
  .get(communityController.getCommunityDetails)
  .patch(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkAdmin,
    uploadCommunityImage.single('community_pict'),
    communityController.editCommunity
  )
  .delete(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkOwner,
    communityController.deleteCommunity
  );

// Membership
communityRouter.post(
  '/:id/join',
  authorizationMiddleware.checkLogin,
  memberController.joinCommunity
);
communityRouter.get(
  '/:id/memberships',
  authorizationMiddleware.checkLogin,
  communityMiddleware.checkMember,
  memberController.getCommunityMember
);
communityRouter
  .route('/:id/memberships/:userId')
  .patch(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkOwner,
    memberController.updateRole
  );
communityRouter
  .route('/:id/memberships/leave')
  .delete(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    memberController.leaveCommunity
  );

// request join
communityRouter.get(
  '/:id/requests',
  authorizationMiddleware.checkLogin,
  communityMiddleware.checkAdmin,
  requestController.getRequestCommunity
);
communityRouter.patch(
  '/:id/requests/:requestId',
  authorizationMiddleware.checkLogin,
  communityMiddleware.checkAdmin,
  requestController.respondRequest
);

// invitation
communityRouter
  .route('/:id/invitations')
  .get(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkAdmin,
    invitationController.getInvitationCommunity
  )
  .post(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    invitationController.createInvitation
  );

communityRouter
  .route('/:id/invitations/:ivitationId')
  .delete(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkAdmin,
    invitationController.deleteInvite
  );

// post routes
communityRouter
  .route('/:id/posts')
  .get(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    communityPostController.getCommunityPosts
  )
  .post(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    uploadPostImage.array('attachments'),
    communityPostController.createPost
  );

communityRouter
  .route('/:id/posts/:postId')
  .get(
    authorizationMiddleware.checkLogin,
    communityPostController.getPostDetails
  )
  .patch(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkPostOwner,
    uploadPostImage.array('attachments'),
    communityPostController.editPost
  )
  .delete(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkPostOwner,
    communityPostController.deletePost
  );

// comments
communityRouter
  .route('/:id/posts/:postId/comments')
  .get(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    commentController.getComments
  )
  .post(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    uploadCommentImage.single('comment_pict'),
    commentController.postComment
  );
communityRouter
  .route('/:id/posts/:postId/comments/:commentId')
  .delete(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkPostOwner,
    commentController.deleteComment
  );

// classes
communityRouter
  .route('/:id/classes')
  .post(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkAdmin,
    uploadClassImage.single('class_banner'),
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

communityRouter
  .route('/:id/classes/:classId')
  .get(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkMember,
    classController.getClassDetail
  )
  .patch(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkAdmin,
    classController.editClass
  )
  .delete(
    authorizationMiddleware.checkLogin,
    communityMiddleware.checkAdmin,
    classController.deleteClass
  );

// Assessment routes
communityRouter.get(
  '/:id/classes/:classId/assessments',
  classMiddleware.checkMembership,
  assessmentController.getAssessments
);
communityRouter.get(
  '/:id/classes/:classId/assessments/:assessmentId',
  classMiddleware.checkMembership,
  assessmentController.getAssessmentDetail
);
communityRouter.post(
  '/:id/classes/:classId/assessments',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  assessmentController.addAssessment
);
communityRouter.put(
  '/:id/classes/:classId/assessments/:assessmentId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  assessmentController.editAssessment
);
communityRouter.delete(
  '/:id/classes/:classId/assessments/:assessmentId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  assessmentController.deleteAssessment
);

// Assessment Attempt
communityRouter.get(
  '/:id/classes/:classId/assessments/:assessmentId/attempts',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  attemptController.getAttempts
);
communityRouter.get(
  '/:id/classes/:classId/assessments/:assessmentId/attempts/:attemptId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  attemptController.getAttemptDetail
);
// communityRouter.get(
//   '/:id/classes/:classId/assessments/:assessmentId/attempts/my',
//   classMiddleware.checkMembership,
//   attemptController.getMyAttempt
// );
communityRouter.post(
  '/:id/classes/:classId/assessments/:assessmentId/attempts',
  classMiddleware.checkMembership,
  attemptController.addAttempt
);
communityRouter.put(
  '/:id/classes/:classId/assessments/:assessmentId/attempts/:attemptId',
  classMiddleware.checkMembership,
  attemptController.completeAttempt
);
communityRouter.delete(
  '/:id/classes/:classId/assessments/:assessmentId/attempts/:attemptId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  attemptController.deleteAttempt
);

module.exports = communityRouter;
