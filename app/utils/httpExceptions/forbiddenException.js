const httpStatusCode = require('./httpStatus');
const HttpException = require('./httpException');

class ForbiddenException extends HttpException {
  constructor(message, description) {
    super(message, description);
    this.statusCode = httpStatusCode.FORBIDDEN;
    this.isOperation = true;
  }
}

module.exports = ForbiddenException;
