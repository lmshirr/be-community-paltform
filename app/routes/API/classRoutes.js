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

// class
classRouter.get(
  '/',
  authorizationMiddleware.checkLogin,
  classController.getClasses
);

classRouter
  .route('/:classId')
  .get(
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

classRouter
  .route('/:classId/enroll')
  .post(
    authorizationMiddleware.checkLogin,
    classMiddleware.checkMember,
    classController.enrollUser
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

// Assessment routes
classRouter.get(
  '/assessment/:AssessmentId',
  classMiddleware.checkMembership,
  assessmentController.getAssessment
);
classRouter.post(
  '/:ClassId/assessment',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  assessmentController.addAssessment
);
classRouter.patch(
  '/:ClassId/assessment/:AssessmentId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  assessmentController.editAssessment
);
classRouter.delete(
  '/:ClassId/assessment/:AssessmentId',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_video_module,
  assessmentController.deleteAssessment
);

module.exports = classRouter;
