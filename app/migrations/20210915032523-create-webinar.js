'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Webinars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      speaker: {
        type: Sequelize.STRING
      },
      speaker_job :{
        type : Sequelize.STRING
      },
      ClassId: {
        type: Sequelize.INTEGER,
        references: {model: 'Classes', key:'id'},
        onDelete: 'CASCADE',
        allowNull:false
      },
      description: {
        type: Sequelize.STRING 
      },
      date: {
        type: Sequelize.DATE
      },
      time: {
        type: Sequelize.STRING
      },
      link: {
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
    await queryInterface.dropTable('Webinars');
  }
};