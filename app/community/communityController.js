const communityService = require('./communityService');

async function findCommunity(req, res, next) {
  const { key } = req.params;

  let community;

  try {
    community = await communityService.findCommunity(key);
  } catch (error) {
    return next(error);
  }

  return res.json({ community });
}

async function getCommunityDetails(req, res, next) {
  const { id } = req.params;

  let community;
  let total_member;

  try {
    community = await communityService.getCommunityDetail(id);
    total_member = await communityService.getCommunityTotalMember(id);
  } catch (error) {
    return next(error);
  }

  return res.json({
    data: {
      community,
      total_member,
    },
  });
}

async function createCommunity(req, res, next) {
  const { name, type, description, privacy } = req.body;
  const { id: userId } = req.user;
  const { file } = req;

  let community;

  try {
    community = await communityService.createCommunity(
      { name, type, description, privacy },
      userId,
      file
    );
  } catch (error) {
    return next(error);
  }

  return res.status(201).json({
    messages: 'Community created',
    data: community,
  });
}

async function editCommunity(req, res, next) {
  const { id } = req.params;
  const { privacy, name, type, description } = req.body;
  const { files } = req;

  let community;

  try {
    community = await communityService.editCommunity(
      { name, privacy, type, description },
      id,
      files
    );
  } catch (error) {
    return next(error);
  }

  return res.json({
    message: 'Update Community Success',
    data: community,
  });
}

async function deleteCommunity(req, res, next) {
  const { id } = req.params;

  let community;
  try {
    community = await communityService.deleteCommunity(id);
  } catch (error) {
    return next(error);
  }
  return res.status(200).json({
    messages: 'Delete success!',
    data: community,
  });
}

async function getCommunities(req, res, next) {
  const { filter, value } = req.query;

  let communities;
  try {
    communities = await communityService.getCommunities(filter, value);
  } catch (error) {
    return next(error);
  }

  return res.json({ data: communities });
}

async function checkMember(req, res, next) {
  const { communityId, userId } = req.params;

  let member;
  try {
    member = await communityService.checkMember(communityId, userId);
  } catch (error) {
    return next(error);
  }

  return res.json({ data: member });
}

module.exports = {
  getCommunities,
  getCommunityDetails,
  deleteCommunity,
  editCommunity,
  createCommunity,
  findCommunity,
  checkMember,
};
