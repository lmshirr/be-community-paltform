const { BadRequestException } = require('../utils/httpExceptions');

/**
 * PIPE FOR VALIDATION
 */
/**
 *
 * @param {object} schema
 * @param {string} property params| query| body
 * @returns
 */
function usePipes(schema, property) {
  return function (req, res, next) {
    const { body } = req.body;
    console.log(body);
    const { error } = schema.validate(req[property]);

    if (!error) {
      // valid
      return next();
    }

    const { details } = error;
    const message = details.map((i) => i.message).join(',');
    console.log(error, message);

    return next(new BadRequestException('Validation error', message));
  };
}

module.exports = { usePipes };
