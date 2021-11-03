const { sequelize } = require('../shared/db/models');
const { QueryTypes } = require('sequelize');

/**
 *
 * @param {string} user_id
 * @param {string} status
 * @returns {Array} communities
 */
const getCommunityUserJoinOrNot = async (user_id, status) => {
  let communities;

  if (status === 'join') {
    communities = await sequelize.query(
      'SELECT * FROM community c INNER JOIN community_member cm ON c.id = cm.community_id WHERE cm.user_id = ?',
      {
        replacements: [user_id],
        type: QueryTypes.SELECT,
      }
    );
  } else if (status === 'notJoin') {
    communities = await sequelize.query(
      'SELECT * FROM community c INNER JOIN community_member cm ON c.id = cm.community_id WHERE cm.user_id != ?',
      {
        replacements: [user_id],
        type: QueryTypes.SELECT,
      }
    );
  }

  return communities;
};

module.exports = { getCommunityUserJoinOrNot };
