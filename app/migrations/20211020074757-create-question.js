'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('question', {
      pk: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
      },
      assessment_id: {
        type: Sequelize.UUID,
        allowNull: false,
        reference: {
          model: 'assessment',
          key: 'id',
        },
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      choice_a: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      choice_b: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      choice_c: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      choice_d: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      correct_answer: {
        type: Sequelize.STRING,
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('question');
  }
};
