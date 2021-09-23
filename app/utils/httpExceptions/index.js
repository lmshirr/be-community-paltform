const BadRequestException = require('./badRequestException');
const InternalServerException = require('./internalServerException');
const ConflictException = require('./conflictException');
const ForbiddenException = require('./forbiddenException');
const NotFoundException = require('./notFoundException');
const UnauthorizedException = require('./unauthorizedException');

module.exports = {
  BadRequestException,
  InternalServerException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
};
