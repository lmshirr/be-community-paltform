'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comment', {
      pk: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      post_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'community_post', key: 'id' },
      },
      comment_uri: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false,
      },
      member_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'community_member', key: 'id' },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('comment');
  },
};
