'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('request_membership', {
      pk: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: Sequelize.UUID,
        references: { model: 'user', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      community_id: {
        type: Sequelize.UUID,
        references: { model: 'community', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending'),
        defaultValue: 'pending',
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
    await queryInterface.dropTable('request_membership');
  },
};
