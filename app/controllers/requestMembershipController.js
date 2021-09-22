const { Request_Membership, Community_Member } = require('../models/index');
const {
  InternalServerException,
  BadRequestException,
  ForbiddenException,
} = require('../utils/httpExceptions');

module.exports.getRequestUser = async function (req, res, next) {
  const { id: user_id } = req.user;

  let request;
  try {
    request = await Request_Membership.findAll({
      where: {
        user_id,
      },
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({
    data: request,
  });
};

module.exports.getRequestCommunity = async function (req, res, next) {
  const { community_id } = req.query;

  let request;
  try {
    request = await Request_Membership.findAll({
      where: {
        community_id,
      },
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({
    data: request,
  });
};

module.exports.respondRequest = async function (req, res, next) {
  const { respond, request_id } = req.query;

  try {
    if (!respond) {
      return next(new BadRequestException('Please input the respond'));
    }

    let request = await Request_Membership.findOne({
      where: { id: request_id },
    });

    if (respond === 'refuse') {
      request = await request.update({
        status: 'refused',
      });
      return res.json({
        messages: 'Request refused',
        data: request,
      });
    }

    if (respond === 'approve') {
      const { user_id, community_id } = request;

      const member = await Community_Member.create({
        user_id,
        community_id,
      });

      await Request_Membership.destroy({ where: { id: request_id } });

      return res.json({
        messages: 'Request approved',
        data: member,
      });
    }
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }
};

module.exports.deleteRequest = async function (req, res, next) {
  const { request_id } = req.query;
  const { id: user_id } = req.user;

  let request;
  try {
    request = await Request_Membership.findOne({ where: { id: request_id } });

    if (request.user_id !== user_id) {
      return next(
        new ForbiddenException('You have not allowed to do this action')
      );
    }

    request = await request.destroy();
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({
    messages: 'Delete success!',
    data: request,
  });
};
