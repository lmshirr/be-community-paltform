'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attempt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Assessment, Attempt_Question }) {
      Attempt.belongsTo(User, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'user',
      });
      Attempt.belongsTo(Assessment, {
        foreignKey: 'assessment_id',
        targetKey: 'id',
        as: 'assessment',
      });
      Attempt.hasMany(Attempt_Question, {
        onDelete: 'cascade',
        foreignKey: 'attempt_id',
        sourceKey: 'id',
        as: 'questions',
      });
    }
  }
  Attempt.init(
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
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'User', key: 'id' },
      },
      assessment_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Assessment', key: 'id' },
      },
      total_score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      finish_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: false,
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
      modelName: 'Attempt',
      tableName: 'attempt',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Attempt;
};
