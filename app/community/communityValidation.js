const Joi = require('joi');

const communityBodySchemas = {
  createCommunity: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().required(),
    description: Joi.string().required(),
    privacy: Joi.string().valid('public', 'private').required(),
    community_pict: Joi.optional(),
  }),
  editCommunity: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().required(),
    description: Joi.string().required(),
    privacy: Joi.string().valid('public', 'private').required(),
  }),
};

const communityParamSchemas = {
  communityId: Joi.object().keys({
    communityId: Joi.string().guid({ version: 'uuidv4' }),
  }),
  communityIdUserId: Joi.object().keys({
    communityId: Joi.string().guid({ version: 'uuidv4' }),
    userId: Joi.string().guid({ version: 'uuidv4' }),
  }),
};

const communityQuerySchemas = {
  getCommunities: Joi.object().keys({
    filter: Joi.string().valid('type', 'name'),
    value: Joi.string(),
  }),
};

module.exports = {
  communityBodySchemas,
  communityParamSchemas,
  communityQuerySchemas,
};
