const express = require('express');
const moduleController = require('./moduleController');
const authorizationMiddleware = require('../shared/middleware/authorizationMiddleware');
const { communityMiddleware } = require('../community');
const { uploadDocMiddleware } = require('../shared/utils/cloudStorage');
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
    uploadDocMiddleware.single('file_uri'),
    usePipes(moduleBodySchemas.createModule, 'body'),
    moduleController.addModule
);

moduleRouter.route('/:moduleId')
.get(
    usePipes(moduleParamSchemas.moduleId, 'params'),
    authorizationMiddleware.checkLogin,
    moduleController.getModuleById
)
.patch(
    usePipes(moduleParamSchemas.moduleId, 'params'),
    authorizationMiddleware.checkLogin,
    uploadDocMiddleware.single('file_uri'),
    usePipes(moduleBodySchemas.editModule, 'body'),
    moduleController.editModule
)
.delete(
    usePipes(moduleParamSchemas.moduleId, 'params'),
    authorizationMiddleware.checkLogin,
    moduleController.deleteModule
);

moduleRouter.route('/class/:classId')
.get(
    usePipes(moduleParamSchemas.classId, 'params'),
    authorizationMiddleware.checkLogin, 
    moduleController.getModuleByClass
);

module.exports = moduleRouter;