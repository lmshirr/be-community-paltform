'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attempt_Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Attempt, Question }) {
      Attempt_Question.belongsTo(Attempt, {
        foreignKey: { name: 'attempt_id' },
        targetKey: 'id',
      });
      Attempt_Question.belongsTo(Question, {
        foreignKey: { name: 'question_id' },
        targetKey: 'id',
      });
    }
  }
  Attempt_Question.init(
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
      attempt_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Attempt', key: 'id' },
      },
      question_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Question', key: 'id' },
      },
      choosed_answer: {
        type: DataTypes.STRING,
        allowNull: false,
        enum: ['A', 'B', 'C', 'D'],
      },
      question_score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Attempt_Question',
      tableName: 'attempt_question',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Attempt_Question;
};
