'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Community_Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Community_Post, Comment }) {
      Community_Member.belongsTo(User, {
        foreignKey: 'user_id',
        targetKey: 'id',
      });
      Community_Member.hasMany(Community_Post, {
        foreignKey: 'member_id',
        sourceKey: 'id',
      });
      Community_Member.hasMany(Comment, {
        foreignKey: 'member_id',
        sourceKey: 'id',
      });
    }
  }
  Community_Member.init(
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
        references: { model: 'user', key: 'id' },
      },
      community_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'community', key: 'id' },
      },
      role: {
        type: DataTypes.ENUM('member', 'owner', 'administrator'),
        allowNull: false,
        defaultValue: 'member',
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
      modelName: 'Community_Member',
      tableName: 'community_member',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Community_Member;
};
