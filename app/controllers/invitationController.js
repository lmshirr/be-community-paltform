const invitationService = require('../services/invitationServices');

const getInvitationCommunity = async function (req, res, next) {
  const { id: community_id } = req.params;

  let invitation;

  try {
    invitation = await invitationService.getInvitationCommunity(community_id);
  } catch (error) {
    return next(error);
  }

  return res.json({
    data: invitation,
  });
};

const createInvitation = async function (req, res, next) {
  const { id: community_id } = req.params;
  const { user_id } = req.query;
  const { id: inviterId } = req.user;

  let invite;

  try {
    invite = await invitationService.createInvitation(
      user_id,
      community_id,
      inviterId
    );
  } catch (error) {
    return next(error);
  }

  return res.status(201).json({
    messages: 'User invited',
    data: invite,
  });
};

const respondInvite = async function (req, res, next) {
  const { respond } = req.body;
  const { invitationId: id } = req.params;
  const { id: userId } = req.user;

  let data;
  try {
    data = await invitationService.respondInvite(id, userId, respond);
  } catch (error) {
    return next(error);
  }

  return res.json(data);
};

const deleteInvite = async function (req, res, next) {
  const { invitationId } = req.params;

  let invitation;
  try {
    invitation = await invitationService.deleteInvitation(invitationId);
  } catch (error) {
    return next(error);
  }

  return res.json({
    message: 'Success delete invitation',
    data: invitation,
  });
};

module.exports = {
  getInvitationCommunity,
  deleteInvite,
  createInvitation,
  respondInvite,
};
