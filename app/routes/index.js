const express = require('express');
const { userRoute } = require('../user');
const { communityRoute } = require('../community');
const { communityPostRoute } = require('../communityPost');
const { classRoute } = require('../class');
const { assessmentRoute } = require('../assessment');
const { commentRoute } = require('../comment');
const { moduleRoute } = require('../module')

const apiRouter = express.Router();

apiRouter.use('/users', userRoute);
apiRouter.use('/communities', communityRoute, commentRoute, communityPostRoute);
apiRouter.use('/posts', communityPostRoute);
apiRouter.use('/classes', classRoute, assessmentRoute);
apiRouter.use('/module', moduleRoute);

module.exports = apiRouter;
