'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Class,
    }) {
      Module.belongsTo(Class, {
        foreignKey: 'class_id',
        targetKey: 'id',
      });
    }
  }
  Module.init(
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
      file_uri: {
        type: DataTypes.STRING,
        defaultValue: 'default.pdf',
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Module',
      freezeTableName: true,
      timestamps: false,
      tableName: 'module',
    }
  );
  return Module;
};
