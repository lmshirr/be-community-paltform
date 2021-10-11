const multer = require('multer');
const uuid = require('uuid');
const path = require('path');

// profile storate
const profileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log(req.body);
    callback(null, '../assets/profile_pict');
  },
  filename: (req, file, callback) => {
    callback(null, uuid.v4() + path.extname(file.originalname));
  },
});

// community storage
const communityStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log(req.body);
    callback(null, '../assets/community_pict');
  },
  filename: (req, file, callback) => {
    callback(null, uuid.v4() + path.extname(file.originalname));
  },
});

// post storage
const postStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log(req.body);
    callback(null, '../assets/post_pict');
  },
  filename: (req, file, callback) => {
    callback(null, uuid.v4() + path.extname(file.originalname));
  },
});

// module storage
const moduleAndVideoStorage = multer.diskStorage({
  destination: (req, file, next) => {
    if (req.url.includes('module')) {
      next(null, 'assets/class/modules');
    }
    if (req.url.includes('video')) {
      next(null, 'assets/class/videos');
    }
  },
  filename: (req, file, next) => {
    next(null, uuid.v4() + path.extname(file.originalname));
  },
});

//
const commentStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log(req.body);
    callback(null, '../assets/comment_pict');
  },
  filename: (req, file, callback) => {
    callback(null, uuid.v4() + path.extname(file.originalname));
  },
});

//
const classStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, '../assets/class_banner');
  },
  filename: (req, file, callback) => {
    callback(null, uuid.v4() + path.extname(file.originalname));
  },
});

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

// upload constanst
const uploadProfileImage = multer({
  storage: profileStorage,
  fileFilter: imageFileFilter,
});

const uploadCommunityImage = multer({
  storage: communityStorage,
  fileFilter: imageFileFilter,
});

const uploadPostImage = multer({
  storage: postStorage,
  fileFilter: imageFileFilter,
});

const uploadClassModuleOrVideo = multer({
  storage: moduleAndVideoStorage,
  fileFilter: pdfAndVideoFileFilter,
});

const uploadCommentImage = multer({
  storage: commentStorage,
  fileFilter: imageFileFilter,
});

const uploadClassImage = multer({
  storage: classStorage,
  fileFilter: imageFileFilter,
});

module.exports = {
  uploadCommunityImage,
  uploadProfileImage,
  uploadPostImage,
  uploadClassModuleOrVideo,
  uploadCommentImage,
  uploadClassImage,
};
