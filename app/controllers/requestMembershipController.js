const { Request_Membership, Community_Member } = require('../models/index');
const {
  InternalServerException,
  BadRequestException,
  ForbiddenException,
} = require('../utils/httpExceptions');

module.exports.getRequestCommunity = async function (req, res, next) {
  const { id: community_id } = req.params;

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
  const { requestId: request_id, id: community_id } = req.params;
  const { respond } = req.body;

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
      const { user_id } = request;

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
