const express = require('express');
const userRoutes = require('./API/userRoutes');
const communityRoutes = require('./API/communityRoutes');
const communityPostRoutes = require('./API/communityPostRoutes');
const classRoutes = require('./API/classRoutes');
const commentRouter = require('./API/commentRoutes');

const apiRouter = express.Router();

apiRouter.use('/users', userRoutes);
apiRouter.use('/communities', communityRoutes);
apiRouter.use('/posts', communityPostRoutes);
apiRouter.use('/classes', classRoutes);
apiRouter.use('/comments', commentRouter);

module.exports = apiRouter;
