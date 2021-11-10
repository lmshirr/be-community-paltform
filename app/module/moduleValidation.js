const Joi = require('joi');

const moduleBodySchemas = {
  createModule: Joi.object().keys({
    class_id: Joi.string().guid({ version: 'uuidv4' }).required(),
    filename: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    privacy: Joi.string().valid('public', 'private').required(),
    // file: Joi.object(),
  }),
  // editModule: Joi.object().keys({
  //   name: Joi.string().required(),
  //   type: Joi.string().required(),
  //   description: Joi.string().required(),
  //   privacy: Joi.string().valid('public', 'private').required(),
  //   files: Joi.array(),
  // }),
};

const moduleParamSchemas = {
  moduleId: Joi.object().keys({
    moduleId: Joi.string().guid({ version: 'uuidv4' }),
  }),
  classId: Joi.object().keys({
    classId: Joi.string().guid({ version: 'uuidv4' }),
  })
};

module.exports = {
    // communityBodySchemas,
    // communityParamSchemas,
    // communityQuerySchemas,
    moduleBodySchemas,
    moduleParamSchemas,
  };