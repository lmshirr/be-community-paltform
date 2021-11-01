const { Storage } = require('@google-cloud/storage');
const config = require('config');

const gc = new Storage({
  projectId: config.get('GCS.project_id'),
  credentials: {
    client_email: config.get('GCS.client_email'),
    private_key: config.get('GCS.private_key'),
  },
});

const sagaraProjectBucket = gc.bucket('sagara-project-staging');

module.exports = { sagaraProjectBucket };
