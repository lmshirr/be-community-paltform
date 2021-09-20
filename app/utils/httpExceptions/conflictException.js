const httpStatusCode = require('./httpStatus');
const HttpException = require('./httpException');

class ConflictException extends HttpException {
  constructor(message, description) {
    super(message, description);
    this.statusCode = httpStatusCode.CONFLICT;
    this.isOperation = true;
  }
}

module.exports = ConflictException;
