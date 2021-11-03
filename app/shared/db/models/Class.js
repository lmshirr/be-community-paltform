'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Community,
      Module,
      Video,
      Assessment,
      Webinar,
      Community_Member,
    }) {
      Class.belongsTo(Community, {
        foreignKey: 'community_id',
        targetKey: 'id',
      });
      Class.belongsTo(Community_Member, {
        foreignKey: 'member_id',
        targetKey: 'id',
      });
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
      member_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Community_Member', key: 'id' },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      banner_uri: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'banner.jpg',
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      about: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      students: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      video_intro_uri: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'video_intro.mp4',
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