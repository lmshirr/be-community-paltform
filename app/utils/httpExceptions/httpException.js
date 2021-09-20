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

module.exports = HttpException;
