const express = require('express');
const userRoutes = require('./API/userRoutes');
const communityRoutes = require('./API/communityRoutes');
const communityPostRoutes = require('./API/communityPostRoutes');
const classRoutes = require('./API/classRoutes');

const apiRouter = express.Router();

apiRouter.use('/users', userRoutes);
apiRouter.use('/communities', communityRoutes);
apiRouter.use('/posts', communityPostRoutes);
apiRouter.use('/classes', classRoutes);

module.exports = apiRouter;
