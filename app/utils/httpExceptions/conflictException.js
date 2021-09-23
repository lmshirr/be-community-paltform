const httpStatusCode = require('./httpStatus');
const HttpException = require('./httpException');

class ConflictException extends HttpException {
  constructor(message, description = 'Conflict error') {
    super(message, description);
    this.statusCode = httpStatusCode.CONFLICT;
    this.isOperation = true;
  }
}

module.exports = ConflictException;
