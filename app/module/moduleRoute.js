const express = require('express');
const moduleController = require('./moduleController');
const authorizationMiddleware = require('../shared/middleware/authorizationMiddleware');
const { communityMiddleware } = require('../community');
const { uploadImageMiddleware } = require('../shared/utils/cloudStorage');
const { usePipes } = require('../shared/middleware/pipesMiddleware');
const {
    moduleParamSchemas,
    moduleBodySchemas,
    moduleQuerySchemas,
  } = require('./moduleValidation');

const moduleRouter = express.Router();

moduleRouter.route('/')
.get(
    authorizationMiddleware.checkLogin,
    moduleController.getModule
)
.post(
    authorizationMiddleware.checkLogin,
    moduleController.addModule
);

moduleRouter.route('/:moduleId')
.get(
    usePipes(moduleParamSchemas.moduleId, 'params'),
    authorizationMiddleware.checkLogin,
    moduleController.getModuleById
)
.patch(
    authorizationMiddleware.checkLogin,
    moduleController.editModule
)
.delete(
    authorizationMiddleware.checkLogin,
    moduleController.deleteModule
);

moduleRouter.get('/class/:classId', authorizationMiddleware.checkLogin, moduleController.getModuleByClass);

module.exports = moduleRouter;