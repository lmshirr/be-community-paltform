const multer = require('multer');
const uuid = require('uuid');
const path = require('path');

const profileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log(req.body);
    callback(null, '../assets/profile_pict');
  },
  filename: (req, file, callback) => {
    callback(null, uuid.v4() + path.extname(file.originalname));
  },
});

const communityStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log(req.body);
    callback(null, '../assets/community_pict');
  },
  filename: (req, file, callback) => {
    callback(null, uuid.v4() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    return cb(null, true);
  }
  return cb(new Error('Please only upload jpeg, jpg, and png'), false);
};

const uploadProfileImage = multer({
  storage: profileStorage,
  fileFilter,
});

const uploadCommunityImage = multer({
  storage: communityStorage,
  fileFilter,
});

module.exports = { uploadCommunityImage, uploadProfileImage };
