const Joi = require('joi');

const communityPostBodySchemas = {
  createPost: Joi.object().keys({
    content: Joi.string(),
    attachments: Joi.any(),
  }),
  editPost: Joi.object().keys({
    content: Joi.string(),
    attachments: Joi.any(),
  }),
};

const communityPostParamSchemas = {
  communityId: Joi.object().keys({
    communityId: Joi.string().guid({ version: 'uuidv4' }),
  }),
  communityIdPostId: Joi.object().keys({
    communityId: Joi.string().guid({ version: 'uuidv4' }),
    postId: Joi.string().guid({ version: 'uuidv4' }),
  }),
};

const communityPostQuerySchemas = {};

module.exports = {
  communityPostBodySchemas,
  communityPostParamSchemas,
  communityPostQuerySchemas,
};
