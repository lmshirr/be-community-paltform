const communityService = require('../services/communityService');

module.exports.findCommunity = async function (req, res, next) {
  const { key } = req.params;

  let community;

  try {
    community = await communityService.findCommunity(key);
  } catch (error) {
    return next(error);
  }

  return res.json({ community });
};

module.exports.getCommunityDetails = async function (req, res, next) {
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
};

module.exports.createCommunity = async function (req, res, next) {
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
};

module.exports.editCommunity = async function (req, res, next) {
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
};

module.exports.deleteCommunity = async function (req, res, next) {
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
};

module.exports.getAllCommunity = async function (req, res, next) {
  const { meta } = req.query;

  let communities;
  try {
    communities = await communityService.getAllCommunity(meta);
  } catch (error) {
    return next(error);
  }

  return res.json({ data: communities });
};
