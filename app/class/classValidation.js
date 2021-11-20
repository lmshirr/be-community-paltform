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
  sortAndDate: Joi.object().keys({
    sort: Joi.string().valid('newest', 'recommended').required(),
    type: Joi.string().required(),
    limit: Joi.number().integer().min(1).max(100),
    page: Joi.number().integer().min(1),
  }),
};

module.exports = {
  classBodySchemas,
  classParamSchemas,
  classQuerySchemas,
};
