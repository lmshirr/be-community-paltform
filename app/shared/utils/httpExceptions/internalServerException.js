const httpStatusCode = require('./httpStatus');
const HttpException = require('./httpException');

class InternalServerException extends HttpException {
  constructor(message = 'Internal server error', description) {
    super(message, description);
    this.statusCode = httpStatusCode.INTERNAL_SERVER_ERROR;
    this.isOperation = true;
  }
}

module.exports = InternalServerException;
