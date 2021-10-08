'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Webinars', {
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
      name: {
        type: Sequelize.STRING,
      },
      speaker: {
        type: Sequelize.STRING,
      },
      speaker_job: {
        type: Sequelize.STRING,
      },
      class_id: {
        type: Sequelize.UUID,
        references: { model: 'class', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATE,
      },
      time: {
        type: Sequelize.STRING,
      },
      link: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Webinars');
  },
};
