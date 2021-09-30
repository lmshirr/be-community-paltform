'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Community, Module, Video, Assessment, Webinar }) {
      Class.belongsTo(Community, { foreignKey: 'community_id' });
      Class.hasMany(Module, { onDelete: 'cascade' });
      Class.hasMany(Video, { onDelete: 'cascade' });
      Class.hasMany(Assessment, { onDelete: 'cascade' });
      Class.hasMany(Webinar, {
        onDelete: 'cascade',
        foreignKey: { name: 'class_id' },
      });
    }
  }
  Class.init(
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
      community_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Community', key: 'id' },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'User', key: 'id' },
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
      modelName: 'Class',
      tableName: 'class',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Class;
};
