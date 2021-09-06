'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Community_Post_Attachments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CommunityPostId: {
        type: Sequelize.INTEGER,
        references: {model: 'Community_Posts', key:'id'},
        onDelete: 'CASCADE',
        allowNull:false
      },
      filename: {
        type: Sequelize.STRING,
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
    await queryInterface.removeConstraint('Community_Post_Attachments', 'Community_Post_Attachments_CommunityPostId_fkey');
    await queryInterface.dropTable('Community_Post_Attachments');
  }
};