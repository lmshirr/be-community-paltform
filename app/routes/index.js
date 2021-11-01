const express = require('express');
const { userRoute } = require('../user');
const { communityRoute } = require('../community');
const { communityPostRoute } = require('../communityPost');
const { classRoute } = require('../class');
const { commentRoute } = require('../comment');

const apiRouter = express.Router();

apiRouter.use('/users', userRoute);
apiRouter.use('/communities', communityRoute, commentRoute, communityPostRoute);
apiRouter.use('/posts', communityPostRoute);
apiRouter.use('/classes', classRoute);

module.exports = apiRouter;
