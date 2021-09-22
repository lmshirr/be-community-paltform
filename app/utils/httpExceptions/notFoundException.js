const httpStatusCode = require('./httpStatus');
const HttpException = require('./httpException');

class NotFoundException extends HttpException {
  constructor(message, description = 'Not found error') {
    super(message, description);
    this.statusCode = httpStatusCode.NOT_FOUND;
    this.isOperation = true;
  }
}

module.exports = NotFoundException;
