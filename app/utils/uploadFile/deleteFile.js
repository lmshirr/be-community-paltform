const { sagaraProjectBucket } = require('./googleCloudStorage');

/**
 *
 * @param {string} filename
 */
async function deleteFile(filename) {
  await sagaraProjectBucket.file(filename).delete({ ignoreNotFound: true });
}

module.exports = { deleteFile };
