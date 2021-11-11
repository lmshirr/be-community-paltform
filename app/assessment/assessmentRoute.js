const { Router } = require('express');
const assessmentController = require('./assessmentController');
const attemptController = require('./attemptController');
const authorizationMiddleware = require('../shared/middleware/authorizationMiddleware');
const classMiddleware = require('../class/classMiddleware');

const assessmentRouter = Router();

// Assessment routes
assessmentRouter.get(
  '/:classId/assessments',
  classMiddleware.checkMembership,
  assessmentController.getAssessments
);
assessmentRouter.get(
  '/:classId/assessments/:assessmentId',
  classMiddleware.checkMembership,
  assessmentController.getAssessmentDetail
);
assessmentRouter.post(
  '/:classId/assessments',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  assessmentController.addAssessment
);
assessmentRouter.put(
  '/:classId/assessments/:assessmentId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  assessmentController.editAssessment
);
assessmentRouter.delete(
  '/:classId/assessments/:assessmentId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  assessmentController.deleteAssessment
);

// Assessment Attempt routes
assessmentRouter.get(
  '/:classId/assessments/:assessmentId/attempts',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  attemptController.getAttempts
);
assessmentRouter.get(
  '/:classId/assessments/:assessmentId/attempts/:attemptId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  attemptController.getAttemptDetail
);
// assessmentRouter.get(
//   '/:classId/assessments/:assessmentId/attempts/my',
//   classMiddleware.checkMembership,
//   attemptController.getMyAttempt
// );
assessmentRouter.post(
  '/:classId/assessments/:assessmentId/attempts',
  classMiddleware.checkMembership,
  attemptController.addAttempt
);
assessmentRouter.put(
  '/:classId/assessments/:assessmentId/attempts/:attemptId',
  classMiddleware.checkMembership,
  attemptController.completeAttempt
);
assessmentRouter.delete(
  '/:classId/assessments/:assessmentId/attempts/:attemptId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  attemptController.deleteAttempt
);

module.exports = assessmentRouter;
