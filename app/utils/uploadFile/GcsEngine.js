const path = require('path');
const uuid = require('uuid');

const defaultFileName = (req, file) => {
  const fileExt = path.extname(file.originalname);

  return uuid.v4() + fileExt;
};

/* eslint-disable no-underscore-dangle */
class GcsStorage {
  constructor(opts) {
    this.bucket = opts.bucket;
    this.fileFn = opts.fileName || defaultFileName;
    this.resumable = opts.resumable || false;
  }

  _handleFile(req, file, cb) {
    if (!this.bucket) {
      return cb(new Error('Bucket is required field'));
    }

    // eslint-disable-next-line prefer-destructuring
    const filename = this.fileFn(req, file, cb);

    const storageFile = this.bucket.file(filename);
    const outStream = storageFile.createWriteStream({
      gzip: true,
      resumable: this.resumable,
    });
    const fileReadStream = file.stream;

    fileReadStream
      .pipe(outStream)
      .on('error', (err) => {
        outStream.end();
        storageFile.delete({ ignoreNotFound: true });
        cb(err);
      })
      .on('finish', () => {
        console.log('finish');
        cb(null, { filename });
      });
  }

  _removeFile(req, file, cb) {
    this.bucket.file(file.name).delete({ ignoreNotFound: true });
    cb(null);
  }
}

module.exports = function (opts) {
  return new GcsStorage(opts);
};
