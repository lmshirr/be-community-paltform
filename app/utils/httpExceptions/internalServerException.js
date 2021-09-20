const httpStatusCode = require('./httpStatus');
const HttpException = require('./httpException');

class InternalServerException extends HttpException {
  constructor(message, description) {
    super((message = 'Internal server error'), description);
    this.statusCode = httpStatusCode.INTERNAL_SERVER_ERROR;
    this.isOperation = true;
  }
}

module.exports = InternalServerException;
