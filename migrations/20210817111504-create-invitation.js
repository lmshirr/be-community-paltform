'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Invitations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Inviter:{
        type: Sequelize.INTEGER,
        references: {model: 'Users', key:'id'},
        onDelete: 'CASCADE',
        allowNull:false
      },
      UserId:{
        type: Sequelize.INTEGER,
        references: {model: 'Users', key:'id'},
        onDelete: 'CASCADE',
        allowNull:false
      },
      CommunityId:{
        type: Sequelize.INTEGER,
        references: {model: 'Communities', key:'id'},
        onDelete: 'CASCADE',
        allowNull:false
      },
      status: {
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
    await queryInterface.removeConstraint('Invitations', 'Invitations_Inviter_fkey');
    await queryInterface.removeConstraint('Invitations', 'Invitations_UserId_fkey');
    await queryInterface.removeConstraint('Invitations', 'Invitations_CommunityId_fkey');
    await queryInterface.dropTable('Invitations');
  }
};
