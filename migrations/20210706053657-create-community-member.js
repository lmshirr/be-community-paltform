'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Community_Members', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CommunityId: {
        type: Sequelize.INTEGER,
        references: {model: 'Communities', key:'id'},
        onDelete: 'CASCADE'
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {model: 'Users', key:'id'},
        onDelete: 'CASCADE'
      },
      role: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Community_Members', 'Community_Members_CommunityId_fkey');
    await queryInterface.removeConstraint('Community_Members', 'Community_Members_UserId_fkey');
    await queryInterface.dropTable('Community_Members');
  }
};