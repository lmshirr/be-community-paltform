const { Router } = require('express');
const classController = require('./classController');
const moduleController = require('../module/moduleController');
// const videoController = require('../controllers/videoController');
const webinarController = require('../webminar/webinarController');
const assessmentController = require('../assessment/assessmentController');
const attemptController = require('../assessment/attemptController');
const authorizationMiddleware = require('../shared/middleware/authorizationMiddleware');
const classMiddleware = require('./classMiddleware');
const {
  uploadDocMiddleware,
  uploadVideoMiddleware,
} = require('../shared/utils/cloudStorage');
const { usePipes } = require('../shared/middleware/pipesMiddleware');
const { classParamSchemas } = require('./classValidation');

const classRouter = Router();

/**
 * Base route /classes
 */

// class
classRouter.get(
  '/',
  authorizationMiddleware.checkLogin,
  classController.getClasses
);

classRouter
  .route('/:classId')
  .get(
    usePipes(classParamSchemas.classId, 'params'),
    authorizationMiddleware.checkLogin,
    classMiddleware.checkMember,
    classController.getClassDetail
  )
  .patch(
    authorizationMiddleware.checkLogin,
    classMiddleware.checkAdminCommunity,
    classController.editClass
  )
  .delete(
    authorizationMiddleware.checkLogin,
    classMiddleware.checkAdminCommunity,
    classController.deleteClass
  );

// tes webianr router
classRouter.get('/:class_id/webinar/', webinarController.showWebinar);
classRouter.get('/:class_id/webinar/:id', webinarController.getWebinar);
classRouter.post('/:class_id/webinar/', webinarController.addWebinar);

// Module routes
classRouter.get(
  '/module/:ModuleId',
  classMiddleware.checkMembership,
  moduleController.getModule
);
classRouter.post(
  '/:ClassId/module',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  uploadDocMiddleware.single('module'),
  moduleController.addModule
);
classRouter.patch(
  '/:ClassId/module/:ModuleId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  uploadDocMiddleware.single('module'),
  moduleController.editModule
);
classRouter.delete(
  '/:ClassId/module/:ModuleId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  moduleController.deleteModule
);

// Video routes
// classRouter.get(
//   '/video/:VideoId',
//   classMiddleware.checkMembership,
//   videoController.getVideo
// );
// classRouter.post(
//   '/:ClassId/video',
//   authorizationMiddleware.checkLogin,
//   classMiddleware.checkAdmin_video_module,
//   uploadVideoMiddleware.single('video'),
//   videoController.addVideo
// );
// classRouter.patch(
//   '/:ClassId/video/:VideoId',
//   authorizationMiddleware.checkLogin,
//   classMiddleware.checkAdmin_video_module,
//   uploadVideoMiddleware.single('video'),
//   videoController.editVideo
// );
// classRouter.delete(
//   '/:ClassId/video/:VideoId',
//   authorizationMiddleware.checkLogin,
//   classMiddleware.checkAdmin_video_module,
//   videoController.deleteVideo
// );

// // Assessment routes
// classRouter.get(
//   '/assessment/:AssessmentId',
//   classMiddleware.checkMembership,
//   assessmentController.getAssessments
// );
// classRouter.post(
//   '/:ClassId/assessment',
//   authorizationMiddleware.checkLogin,
//   classMiddleware.checkAdmin_video_module,
//   assessmentController.addAssessment
// );
// classRouter.patch(
//   '/:ClassId/assessment/:AssessmentId',
//   authorizationMiddleware.checkLogin,
//   classMiddleware.checkAdmin_video_module,
//   assessmentController.editAssessment
// );
// classRouter.delete(
//   '/:ClassId/assessment/:AssessmentId',
//   authorizationMiddleware.checkLogin,
//   classMiddleware.checkAdmin_video_module,
//   assessmentController.deleteAssessment
// );

// Assessment routes
classRouter.get(
  '/:classId/assessments',
  classMiddleware.checkMembership,
  assessmentController.getAssessments
);
classRouter.get(
  '/:classId/assessments/:assessmentId',
  classMiddleware.checkMembership,
  assessmentController.getAssessmentDetail
);
classRouter.post(
  '/:classId/assessments',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  assessmentController.addAssessment
);
classRouter.put(
  '/:classId/assessments/:assessmentId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  assessmentController.editAssessment
);
classRouter.delete(
  '/:classId/assessments/:assessmentId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  assessmentController.deleteAssessment
);

// Assessment Attempt routes
classRouter.get(
  '/:classId/assessments/:assessmentId/attempts',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  attemptController.getAttempts
);
classRouter.get(
  '/:classId/assessments/:assessmentId/attempts/:attemptId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  attemptController.getAttemptDetail
);
// classRouter.get(
//   '/:classId/assessments/:assessmentId/attempts/my',
//   classMiddleware.checkMembership,
//   attemptController.getMyAttempt
// );
classRouter.post(
  '/:classId/assessments/:assessmentId/attempts',
  classMiddleware.checkMembership,
  attemptController.addAttempt
);
classRouter.put(
  '/:classId/assessments/:assessmentId/attempts/:attemptId',
  classMiddleware.checkMembership,
  attemptController.completeAttempt
);
classRouter.delete(
  '/:classId/assessments/:assessmentId/attempts/:attemptId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  attemptController.deleteAttempt
);

module.exports = classRouter;
