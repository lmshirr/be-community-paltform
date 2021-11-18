const Joi = require('joi');

const communityBodySchemas = {
  createCommunity: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().required(),
    description: Joi.string().required(),
    privacy: Joi.string().valid('public', 'private').required(),
    community_pict: Joi.any().optional(),
  }),
  editCommunity: Joi.object().keys({
    name: Joi.any().empty(),
    type: Joi.any().empty(),
    description: Joi.any().optional(),
    privacy: Joi.valid('public', 'private').empty(),
    community_pict: Joi.any(),
    community_banner: Joi.any(),
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
