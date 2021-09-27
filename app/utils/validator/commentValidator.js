const validator = require('validator');

function postCommentValidator(postId, userId, body) {
  if (!postId || !body || !userId) return { isValidate: false };

  const errors = {};

  const postIdValidator = validator.isEmpty(postId)
    ? 'post_id must not empty'
    : null;
  if (postIdValidator) errors.post_id = postIdValidator;

  const userIdValidator = validator.isEmpty(userId)
    ? 'user_id must not empty'
    : null;
  if (userIdValidator) errors.user_id = userIdValidator;

  const bodyValidator = validator.isEmpty(body)
    ? 'Body comment must not empty'
    : null;
  if (bodyValidator) errors.body = bodyValidator;

  if (Object.keys(errors).length > 0) return { isValidate: false, errors };
  return { isValidate: true };
}

function getCommentsValidation(postId) {
  if (!postId) return { isValidate: false };

  const errors = {};

  const postIdValidator = validator.isEmpty(postId)
    ? 'post_id must not empty'
    : null;
  if (postIdValidator) errors.post_id = postIdValidator;
}

module.exports = { postCommentValidator, getCommentsValidation };
