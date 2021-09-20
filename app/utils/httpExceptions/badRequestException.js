const httpStatusCode = require('./httpStatus');
const HttpException = require('./httpException');

class BadRequestException extends HttpException {
  constructor(message, description) {
    super(message, description);
    this.statusCode = httpStatusCode.BAD_REQUEST;
    this.isOperation = true;
  }
}

module.exports = BadRequestException;
