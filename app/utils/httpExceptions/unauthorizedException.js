const httpStatusCode = require('./httpStatus');
const HttpException = require('./httpException');

class UnauthorizedException extends HttpException {
  constructor(message, description) {
    super(message, description);
    this.statusCode = httpStatusCode.UNAUTHORIZED;
    this.isOperation = true;
  }
}

module.exports = UnauthorizedException;
