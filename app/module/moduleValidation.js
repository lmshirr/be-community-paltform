const Joi = require('joi');

const moduleBodySchemas = {
  createModule: Joi.object().keys({
    class_id: Joi.string().guid({ version: 'uuidv4' }).required(),
    name: Joi.string().required(),
    file_uri: Joi.optional(),
  }),
  editModule: Joi.object().keys({
    name: Joi.string(),
    file_uri: Joi.optional(),
  }),
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