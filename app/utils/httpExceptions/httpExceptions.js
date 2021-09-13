const httpStatusCode = require("./httpStatusCode");

class HttpException extends Error {
  constructor(message, description, statusCode, isOperational) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.message = message;
    this.description = description;
    this.statusCode = statusCode;
    this.isOperation = isOperational;
  }
}

class BadRequestException extends HttpException {
  constructor(message, description) {
    super(message, description);
    this.statusCode = httpStatusCode.BAD_REQUEST;
    this.isOperation = true;
  }
}

class ConflictException extends HttpException {
  constructor(message, description) {
    super(message, description);
    this.statusCode = httpStatusCode.CONFLICT;
    this.isOperation = true;
  }
}

class ForbiddenException extends HttpException {
  constructor(message, description) {
    super(message, description);
    this.statusCode = httpStatusCode.FORBIDDEN;
    this.isOperation = true;
  }
}

class InternalServerException extends HttpException {
  constructor(message, description) {
    super((message = "Internal server error"), description);
    this.statusCode = httpStatusCode.INTERNAL_SERVER_ERROR;
    this.isOperation = true;
  }
}

class NotFoundException extends HttpException {
  constructor(message, description) {
    super(message, description);
    this.statusCode = httpStatusCode.NOT_FOUND;
    this.isOperation = true;
  }
}

class UnauthorizedException extends HttpException {
  constructor(message, description) {
    super(message, description);
    this.statusCode = httpStatusCode.UNAUTHORIZED;
    this.isOperation = true;
  }
}

module.exports = {
  HttpException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerException,
  UnauthorizedException,
  NotFoundException,
};
