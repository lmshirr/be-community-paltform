'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('community', {
      pk: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id: {
        type: Sequelize.UUID,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      privacy: {
        type: Sequelize.ENUM('private', 'public'),
        allowNull: false,
        defaultValue: 'public',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      community_pict_uri: {
        type: Sequelize.STRING,
        defaultValue: '/assets/community/com_pict.jpg',
        allowNull: false,
      },
      community_banner_uri: {
        type: Sequelize.STRING,
        defaultValue: '/assets/community/com_banner.jpg',
        allowNull: false,
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
    await queryInterface.dropTable('community');
  },
};
