'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Request_Memberships', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
    await queryInterface.removeConstraint('Request_Memberships', 'Request_Memberships_UserId_fkey');
    await queryInterface.removeConstraint('Request_Memberships', 'Request_Memberships_CommunityId_fkey');
    await queryInterface.dropTable('Request_Memberships');
  }
};
