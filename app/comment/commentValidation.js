const Joi = require('joi');

const commentBodySchemas = {
  createComment: Joi.object().keys({
    body: Joi.string(),
    file: Joi.object(),
  }),
};

const commentParamSchemas = {
  communityIdPostId: Joi.object().keys({
    communityId: Joi.string().guid({ version: 'uuidv4' }),
    postId: Joi.string().guid({ version: 'uuidv4' }),
  }),
  communityIdPostIdCommentId: Joi.object().keys({
    communityId: Joi.string().guid({ version: 'uuidv4' }),
    postId: Joi.string().guid({ version: 'uuidv4' }),
    commentId: Joi.string().guid({ version: 'uuidv4' }),
  }),
};

const commentQuerySchemas = {};

module.exports = {
  commentBodySchemas,
  commentParamSchemas,
  commentQuerySchemas,
};
