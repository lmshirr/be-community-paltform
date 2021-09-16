const express = require("express");
const { verification } = require("../controllers/userController");
const apiRouter = express.Router();
const userRoutes = require("./API/userRoutes");
const communityRoutes = require("./API/communityRoutes");
const communityPostRoutes = require("./API/communityPostRoutes");
const classRoutes = require("./API/classRoutes");
const commentRouter = require("./API/commentRoutes");

apiRouter.use("/user", userRoutes);
apiRouter.use("/community", communityRoutes);
apiRouter.use("/communityPost", communityPostRoutes);
apiRouter.use("/class", classRoutes);
apiRouter.use("/comment", commentRouter);

module.exports = apiRouter;
