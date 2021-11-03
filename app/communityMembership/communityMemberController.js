const communityMemberService = require('./communityMemberService');

async function joinCommunity(req, res, next) {
  const { id: userId } = req.user;
  const { id: communityId } = req.params;

  let data;
  try {
    data = await communityMemberService.joinCommunity(communityId, userId);
  } catch (error) {
    return next(error);
  }

  return res.json(data);
}

async function updateRole(req, res, next) {
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
}

async function leaveCommunity(req, res, next) {
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
}

async function getCommunityMember(req, res, next) {
  const { id: community_id } = req.params;

  let members;
  try {
    members = communityMemberService.getCommunityMembers(community_id);
  } catch (error) {
    return next(error);
  }

  return res.json({ data: members });
}

// invitation
async function getInvitationCommunity(req, res, next) {
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
}

async function createInvitation(req, res, next) {
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
}

async function respondInvite(req, res, next) {
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
}

async function deleteInvite(req, res, next) {
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
}

// request membership
async function getRequestCommunity(req, res, next) {
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
}

async function respondRequest(req, res, next) {
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
}

module.exports = {
  joinCommunity,
  respondRequest,
  getRequestCommunity,
  respondInvite,
  deleteInvite,
  createInvitation,
  getInvitationCommunity,
  getCommunityMember,
  leaveCommunity,
  updateRole,
};
