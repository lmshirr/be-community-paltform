const express = require('express');
const classController = require('../../controllers/classController');
const moduleController = require('../../controllers/moduleController');
const videoController = require('../../controllers/videoController');
const authorizationMiddleware = require('../../middleware/authorizationMiddleware');
const classMiddleware = require('../../middleware/classMiddleware');
const {
  uploadClassModuleOrVideo,
} = require('../../utils/multer/uploadImage.service');

const classRouter = express.Router();

classRouter.get('/search/:key', classController.findClass);
classRouter.post(
  '/',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_post,
  classController.createClass
);
classRouter
  .route('/:id')
  .get(classMiddleware.checkMembership, classController.getClassDetails)
  .patch(
    authorizationMiddleware.checkLogin,
    classMiddleware.checkAdmin_delete_patch,
    classController.editClass
  )
  .delete(
    authorizationMiddleware.checkLogin,
    classMiddleware.checkAdmin_delete_patch,
    classController.deleteClass
  );

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

module.exports = classRouter;
