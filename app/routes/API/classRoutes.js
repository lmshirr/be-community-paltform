const { Router } = require('express');
const classController = require('../../controllers/classController');
const moduleController = require('../../controllers/moduleController');
const videoController = require('../../controllers/videoController');
const webinarController = require('../../controllers/webinarController');
const assessmentController = require('../../controllers/assessmentController');
const authorizationMiddleware = require('../../middleware/authorizationMiddleware');
const classMiddleware = require('../../middleware/classMiddleware');
const {
  uploadClassModuleOrVideo,
} = require('../../utils/multer/uploadImage.service');

const classRouter = Router();

// tes webianr router
classRouter.get('/:class_id/webinar/', webinarController.showWebinar);
classRouter.get('/:class_id/webinar/:id', webinarController.getWebinar);
classRouter.get('/:class_id/webinar/', webinarController.showWebinar);

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
  uploadClassModuleOrVideo.single('module'),
  moduleController.addModule
);
classRouter.patch(
  '/:ClassId/module/:ModuleId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  uploadClassModuleOrVideo.single('module'),
  moduleController.editModule
);
classRouter.delete(
  '/:ClassId/module/:ModuleId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  moduleController.deleteModule
);

// Video routes
classRouter.get(
  '/video/:VideoId',
  classMiddleware.checkMembership,
  videoController.getVideo
);
classRouter.post(
  '/:ClassId/video',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  uploadClassModuleOrVideo.single('video'),
  videoController.addVideo
);
classRouter.patch(
  '/:ClassId/video/:VideoId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  uploadClassModuleOrVideo.single('video'),
  videoController.editVideo
);
classRouter.delete(
  '/:ClassId/video/:VideoId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  videoController.deleteVideo
);

const test = (req, res, next) => {
  console.log('test');
  console.log('--------------------------------------------------------');
  next();
};

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
  test,
  assessmentController.addAssessment
);
classRouter.patch(
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

module.exports = classRouter;
