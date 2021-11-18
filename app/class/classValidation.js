const Joi = require('joi');

const classBodySchemas = {
  createClass: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    summary: Joi.string().required(),
    about: Joi.string().required(),
    file: Joi.object(),
  }),
};

const classParamSchemas = {
  classId: Joi.object().keys({
    classId: Joi.string().guid({ version: 'uuidv4' }),
  }),
};

const classQuerySchemas = {
  sortAndType: Joi.object().keys({
    sort: Joi.string().valid('newest', 'recommended').required(),
    type: Joi.string(),
  }),
};

module.exports = {
  classBodySchemas,
  classParamSchemas,
  classQuerySchemas,
};
