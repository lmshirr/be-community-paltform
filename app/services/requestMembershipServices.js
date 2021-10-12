const { Request_Membership, Community_Member } = require('../models/index');
const { NotFoundException } = require('../utils/httpExceptions');

const getRequestCommunity = async (community_id) => {
  const request = await Request_Membership.findAll({
    where: {
      community_id,
    },
  });

  return request;
};

/**
 *
 * @param {string} id request id
 * @param {string} community_id
 * @param {string} respond
 * @returns {message: string, respondData: Object}
 */
const respondRequest = async (id, community_id, respond) => {
  const request = await Request_Membership.findOne({
    where: { id },
  });

  if (!request) {
    throw new NotFoundException('Request not found');
  }

  let message;
  let respondData;

  if (respond === 'refuse') {
    respondData = await request.update({
      status: 'refused',
    });

    message = 'Request refused';
  } else if (respond === 'approve') {
    const { user_id } = request;

    respondData = await Community_Member.create({
      user_id,
      community_id,
    });

    await Request_Membership.destroy({ where: { id } });

    message = 'Request approved';
  }

  return { respondData, message };
};

module.exports = { getRequestCommunity, respondRequest };
