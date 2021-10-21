'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Assessment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Class, Question }) {
      Assessment.belongsTo(Class, {
        foreignKey: 'class_id',
        targetKey: 'id',
        // as: 'class',
      });
      Assessment.hasMany(Question, {
        onDelete: 'cascade',
        foreignKey: 'assessment_id',
        // as: 'questions',
      });
    }
  }
  Assessment.init(
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
      class_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Class', key: 'id' },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      question_count: {
        type: DataTypes.INTEGER,
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
      modelName: 'Assessment',
      tableName: 'assessment',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Assessment;
};
