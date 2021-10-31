'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('class', {
      pk: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
      },
      community_id: {
        type: Sequelize.UUID,
        references: { model: 'community', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      member_id: {
        type: Sequelize.UUID,
        references: { model: 'community_member', key: 'id' },
        onDelete: 'cascade',
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      banner_uri: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'banner.jpg',
      },
      summary: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      students: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      video_intro_uri: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'video_intro.mp4',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('class');
  },
};
