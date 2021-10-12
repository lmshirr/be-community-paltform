const communityMemberService = require('../services/communityMemberServices');

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
