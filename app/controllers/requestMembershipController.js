const requestMembershipService = require('../services/requestMembershipServices');

const getRequestCommunity = async function (req, res, next) {
  const { id: communityId } = req.params;

  let request;
  try {
    request = await requestMembershipService.getRequestCommunity(communityId);
  } catch (error) {
    return next(error);
  }

  return res.json({
    data: request,
  });
};

const respondRequest = async function (req, res, next) {
  const { requestId, id: community_id } = req.params;
  const { respond } = req.body;

  let data;

  try {
    data = await requestMembershipService.respondRequest(
      requestId,
      community_id,
      respond
    );
  } catch (error) {
    return next(error);
  }

  return res.json(data);
};

module.exports = { respondRequest, getRequestCommunity };
