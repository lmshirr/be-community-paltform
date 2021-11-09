const { sequelize } = require('../shared/db/models');
const { QueryTypes } = require('sequelize');
const urlJoin = require('url-join');
const config = require('config');

/**
 *
 * @param {string} user_id
 * @param {string} status
 * @returns {Array} communities
 */
const getCommunityUserJoinOrNot = async (user_id, status) => {
  let communities;
  const bucketUrl = urlJoin(config.get('GCS.bucket_url'), '/');

  if (status === 'join') {
    communities = await sequelize.query(
      'SELECT *, CONCAT(?, community_pict_uri) AS community_pict FROM community c INNER JOIN community_member cm ON c.id = cm.community_id WHERE cm.user_id = ?',
      {
        replacements: [bucketUrl, user_id],
        type: QueryTypes.SELECT,
      }
    );
  } else if (status === 'notJoin') {
    communities = await sequelize.query(
      'SELECT *, CONCAT(?, community_pict_uri) AS community_pict FROM community c INNER JOIN community_member cm ON c.id = cm.community_id WHERE cm.user_id != ?',
      {
        replacements: [bucketUrl, user_id],
        type: QueryTypes.SELECT,
      }
    );
  }

  return communities;
};

module.exports = { getCommunityUserJoinOrNot };
