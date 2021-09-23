const express = require('express');
const uuid = require('uuid');
const multer = require('multer');
const path = require('path');
const classRouter = express.Router();
const classController = require('../../controllers/classController');
const moduleController = require('../../controllers/moduleController');
const videoController = require('../../controllers/videoController');
const assessmentController = require('../../controllers/assessmentController');
const authorizationMiddleware = require('../../middleware/authorizationMiddleware');
const classMiddleware = require('../../middleware/classMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, next) {
    if (req.url.includes('module')) {
      next(null, 'assets/class/modules');
    }
    if (req.url.includes('video')) {
      next(null, 'assets/class/videos');
    }
  },
  filename: function (req, file, next) {
    next(null, uuid.v4() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, next) => {
  if (req.url.includes('module')) {
    if (file.mimetype === 'application/pdf') {
      next(null, true);
    } else {
      next(new Error('Please only upload PDF file'), false);
    }
  }
  if (req.url.includes('video')) {
    if (
      file.mimetype === 'video/mp4' ||
      file.mimetype === 'video/avi' ||
      file.mimetype === 'video/mkv' ||
      file.mimetype === 'video/webm'
    ) {
      next(null, true);
    } else {
      next(new Error('Please only upload MP4/AVI/MKV/WEBM file'), false);
    }
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

classRouter.get('/search/:key', classController.findClass);
classRouter.get(
  '/:id',
  classMiddleware.checkMembership,
  classController.getClassDetails
);
classRouter.post(
  '/',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_post,
  classController.createClass
);
classRouter.patch(
  '/:id',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_delete_patch,
  classController.editClass
);
classRouter.delete(
  '/:id',
  authorizationMiddleware.checkLogin,
  classMiddleware.checkAdmin_delete_patch,
  classController.deleteClass
);

// Module routes
classRouter.get('/module/:ModuleId', classMiddleware.checkMembership, moduleController.getModule);
classRouter.post('/:ClassId/module', authorizationMiddleware.checkLogin, classMiddleware.checkAdmin_video_module, upload.single('module'), moduleController.addModule)
classRouter.patch('/:ClassId/module/:ModuleId', authorizationMiddleware.checkLogin, classMiddleware.checkAdmin_video_module, upload.single('module'), moduleController.editModule)
classRouter.delete('/:ClassId/module/:ModuleId', authorizationMiddleware.checkLogin, classMiddleware.checkAdmin_video_module, moduleController.deleteModule)

// Video routes
classRouter.get('/video/:VideoId', classMiddleware.checkMembership, videoController.getVideo);
classRouter.post('/:ClassId/video', authorizationMiddleware.checkLogin, classMiddleware.checkAdmin_video_module, upload.single('video'), videoController.addVideo)
classRouter.patch('/:ClassId/video/:VideoId', authorizationMiddleware.checkLogin, classMiddleware.checkAdmin_video_module, upload.single('video'), videoController.editVideo)
classRouter.delete('/:ClassId/video/:VideoId', authorizationMiddleware.checkLogin, classMiddleware.checkAdmin_video_module, videoController.deleteVideo);

// Assessment routes
classRouter.get('/assessment/:AssessmentId', classMiddleware.checkMembership, assessmentController.getAssessment);
classRouter.post('/:ClassId/assessment', authorizationMiddleware.checkLogin, classMiddleware.checkAdmin_video_module, assessmentController.addAssessment)
classRouter.patch('/:ClassId/assessment/:AssessmentId', authorizationMiddleware.checkLogin, classMiddleware.checkAdmin_video_module, assessmentController.editAssessment)
classRouter.delete('/:ClassId/assessment/:AssessmentId', authorizationMiddleware.checkLogin, classMiddleware.checkAdmin_video_module, assessmentController.deleteAssessment)


module.exports = classRouter;
