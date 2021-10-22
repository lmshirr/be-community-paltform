const multer = require('multer');
const GcsEngine = require('./GcsEngine');
const { sagaraProjectBucket } = require('./googleCloudStorage');

// file filter for image
const imageFileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    return cb(null, true);
  }
  return cb(new Error('Please only upload jpeg, jpg, and png'), false);
};

// file filter for pdf and video
const pdfAndVideoFileFilter = (req, file, next) => {
  if (req.url.includes('module')) {
    if (file.mimetype === 'application/pdf') {
      return next(null, true);
    }
    return next(new Error('Please only upload PDF file'), false);
  }

  if (req.url.includes('video')) {
    if (
      file.mimetype === 'video/mp4' ||
      file.mimetype === 'video/avi' ||
      file.mimetype === 'video/mkv' ||
      file.mimetype === 'video/webm'
    ) {
      return next(null, true);
    }
    return next(new Error('Please only upload MP4/AVI/MKV/WEBM file'), false);
  }
};

// upload constant
const uploadImageMiddleware = multer({
  storage: GcsEngine({ bucket: sagaraProjectBucket }),
  fileFilter: imageFileFilter,
});

const uploadVideoMiddleware = multer({
  storage: GcsEngine({ bucket: sagaraProjectBucket }),
  fileFilter: pdfAndVideoFileFilter,
});

const uploadDocMiddleware = multer({
  storage: GcsEngine({ bucket: sagaraProjectBucket }),
  fileFilter: pdfAndVideoFileFilter,
});

module.exports = {
  uploadImageMiddleware,
  uploadDocMiddleware,
  uploadVideoMiddleware,
};
