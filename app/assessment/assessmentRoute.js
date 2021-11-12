const { Router } = require('express');
const assessmentController = require('./assessmentController');
const attemptController = require('./attemptController');
const authorizationMiddleware = require('../shared/middleware/authorizationMiddleware');
const classMiddleware = require('../class/classMiddleware');
const {
  assessmentBodySchemas,
  assessmentParamSchemas,
} = require('./assessmentValidation');
const {
  attemptBodySchemas,
  attemptParamSchemas,
} = require('./attemptValidation');
const { usePipes } = require('../shared/middleware/pipesMiddleware');

const assessmentRouter = Router();

// Assessment routes
assessmentRouter.get(
  '/:classId/assessments',
  usePipes(assessmentParamSchemas.classId, 'params'),
  classMiddleware.checkMembership,
  assessmentController.getAssessments
);
assessmentRouter.get(
  '/:classId/assessments/:assessmentId',
  usePipes(assessmentParamSchemas.classIdAssessmentId, 'params'),
  classMiddleware.checkMembership,
  assessmentController.getAssessmentDetail
);
assessmentRouter.post(
  '/:classId/assessments',
  usePipes(assessmentParamSchemas.classId, 'params'),
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  usePipes(assessmentBodySchemas.createAssessment, 'body'),
  assessmentController.addAssessment
);
assessmentRouter.put(
  '/:classId/assessments/:assessmentId',
  usePipes(assessmentParamSchemas.classIdAssessmentId, 'params'),
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  usePipes(assessmentBodySchemas.updateAssessment, 'body'),
  assessmentController.editAssessment
);
assessmentRouter.delete(
  '/:classId/assessments/:assessmentId',
  usePipes(assessmentParamSchemas.classIdAssessmentId, 'params'),
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  assessmentController.deleteAssessment
);

// Assessment Attempt routes
assessmentRouter.get(
  '/:classId/assessments/:assessmentId/attempts',
  usePipes(assessmentParamSchemas.classIdAssessmentId, 'params'),
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  attemptController.getAttempts
);
assessmentRouter.get(
  '/:classId/assessments/:assessmentId/attempts/:attemptId',
  usePipes(attemptParamSchemas.classIdAssessmentIdAttemptId, 'params'),
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
  usePipes(assessmentParamSchemas.classIdAssessmentId, 'params'),
  classMiddleware.checkMembership,
  usePipes(attemptBodySchemas.createAttempt, 'body'),
  attemptController.addAttempt
);
assessmentRouter.put(
  '/:classId/assessments/:assessmentId/attempts/:attemptId',
  usePipes(attemptParamSchemas.classIdAssessmentIdAttemptId, 'params'),
  classMiddleware.checkMembership,
  usePipes(attemptBodySchemas.completeAttempt, 'body'),
  attemptController.completeAttempt
);
assessmentRouter.delete(
  '/:classId/assessments/:assessmentId/attempts/:attemptId',
  usePipes(attemptParamSchemas.classIdAssessmentIdAttemptId, 'params'),
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  attemptController.deleteAttempt
);

module.exports = assessmentRouter;
