'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Community_Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CommunityId: {
        type: Sequelize.INTEGER,
        references: {model: 'Communities', key:'id'},
        onDelete: 'CASCADE',
        allowNull:false
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {model: 'Users', key:'id'},
        onDelete: 'CASCADE'
      },
      content: {
        type: Sequelize.TEXT,
        allowNull:false
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
    await queryInterface.removeConstraint('Community_Posts', 'Community_Posts_CommunityId_fkey');
    await queryInterface.removeConstraint('Community_Posts', 'Community_Posts_UserId_fkey');
    await queryInterface.dropTable('Community_Posts');
  }
};