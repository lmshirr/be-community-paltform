'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('person', {
      pk: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id: {
        type: Sequelize.UUID,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      google_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      verified_email: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      given_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      family_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profile_pict: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      locale: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hd: {
        type: Sequelize.STRING,
        allowNull: true,
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
    return queryInterface.dropTable('person');
  },
};
