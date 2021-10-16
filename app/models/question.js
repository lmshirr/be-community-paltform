'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Question.belongsTo(models.Assessment, {
        foreignKey: { name: 'assessment_id' },
      });
    }
  }
  Question.init(
    {
      pk: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      assessment_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Assessment', key: 'id' },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      choice_a: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      choice_b: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      choice_c: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      choice_d: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      correct_answer: {
        type: DataTypes.STRING,
        allowNull: false,
        enum: ['A', 'B', 'C', 'D'],
      },
    },
    {
      sequelize,
      modelName: 'Question',
    }
  );
  return Question;
};
