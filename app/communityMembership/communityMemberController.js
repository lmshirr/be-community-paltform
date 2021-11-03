const communityMemberService = require('./communityMemberService');

module.exports.joinCommunity = async function (req, res, next) {
  const { id: userId } = req.user;
  const { id: communityId } = req.params;

  let data;
  try {
    data = await communityMemberService.joinCommunity(communityId, userId);
  } catch (error) {
    return next(error);
  }

  return res.json(data);
};

module.exports.updateRole = async function (req, res, next) {
  const { id: communityId, userId } = req.params;
  const { role } = req.body;
  const { id: ownerUserId } = req.user;

  let newMemberRole;
  try {
    newMemberRole = await communityMemberService.updateRole(
      communityId,
      userId,
      ownerUserId,
      role
    );
  } catch (error) {
    return next(error);
  }

  return res.json({
    messages: 'Role updated!',
    data: newMemberRole,
  });
};

module.exports.leaveCommunity = async function (req, res, next) {
  const { id: community_id } = req.params;
  const { id: userId } = req.user;
  const { role } = req.member;

  let member;

  try {
    member = await communityMemberService.leaveCommunity(
      userId,
      community_id,
      role
    );
  } catch (error) {
    return next(error);
  }

  return res.json({
    messages: 'You leave the community',
    data: member,
  });
};

module.exports.getCommunityMember = async (req, res, next) => {
  const { id: community_id } = req.params;

  let members;
  try {
    members = await communityMemberService.getCommunityMembers(community_id);
  } catch (error) {
    return next(error);
  }

  return res.json({ data: members });
};

// invitation
module.exports.getInvitationCommunity = async function (req, res, next) {
  const { id: community_id } = req.params;

  let invitation;

  try {
    invitation = await communityMemberService.getInvitationCommunity(
      community_id
    );
  } catch (error) {
    return next(error);
  }

  return res.json({
    data: invitation,
  });
};

module.exports.createInvitation = async function (req, res, next) {
  const { id: community_id } = req.params;
  const { user_id } = req.query;
  const { id: inviterId } = req.user;

  let invite;

  try {
    invite = await communityMemberService.createInvitation(
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

module.exports.respondInvite = async function (req, res, next) {
  const { respond } = req.body;
  const { invitationId: id } = req.params;
  const { id: userId } = req.user;

  let data;
  try {
    data = await communityMemberService.respondInvite(id, userId, respond);
  } catch (error) {
    return next(error);
  }

  return res.json(data);
};

module.exports.deleteInvite = async function (req, res, next) {
  const { invitationId } = req.params;

  let invitation;
  try {
    invitation = await communityMemberService.deleteInvitation(invitationId);
  } catch (error) {
    return next(error);
  }

  return res.json({
    message: 'Success delete invitation',
    data: invitation,
  });
};

// request membership
module.exports.getRequestCommunity = async function (req, res, next) {
  const { id: communityId } = req.params;

  let request;
  try {
    request = await communityMemberService.getRequestCommunity(communityId);
  } catch (error) {
    return next(error);
  }

  return res.json({
    data: request,
  });
};

module.exports.respondRequest = async function (req, res, next) {
  const { requestId, id: community_id } = req.params;
  const { respond } = req.body;

  let data;

  try {
    data = await communityMemberService.respondRequest(
      requestId,
      community_id,
      respond
    );
  } catch (error) {
    return next(error);
  }

  return res.json(data);
};
