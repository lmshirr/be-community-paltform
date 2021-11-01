const {
  uploadDocMiddleware,
  uploadImageMiddleware,
  uploadVideoMiddleware,
} = require('./uploadFile');
const { deleteFile } = require('./deleteFile');

module.exports = {
  uploadVideoMiddleware,
  uploadImageMiddleware,
  uploadDocMiddleware,
  deleteFile,
};
