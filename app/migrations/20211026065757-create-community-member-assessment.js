'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('community_member_assessment', {
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
        references: { model: 'assessment', key: 'id' },
        onDelete: 'CASCADE',
      },
      community_member_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'community_member', key: 'id' },
        onDelete: 'CASCADE',
      },
      total_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      finish_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deadline: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('community_member_assessment');
  },
};
