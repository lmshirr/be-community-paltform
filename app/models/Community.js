'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Community extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      User,
      Request_Membership,
      Invitation,
      Community_Post,
      Class,
      Community_Member,
    }) {
      Community.belongsToMany(User, {
        through: 'Community_Member',
        onDelete: 'cascade',
        foreignKey: 'community_id',
        uniqueKey: false,
        sourceKey: 'id',
      });
      Community.hasMany(Request_Membership, {
        onDelete: 'cascade',
        foreignKey: 'community_id',
      });
      Community.hasMany(Invitation, {
        onDelete: 'cascade',
        foreignKey: 'community_id',
      });
      Community.hasMany(Community_Post, {
        onDelete: 'cascade',
        foreignKey: 'community_id',
      });
      Community.hasMany(Class, {
        onDelete: 'cascade',
        foreignKey: 'community_id',
      });
      Community.hasMany(Community_Member, {
        onDelete: 'cascade',
        foreignKey: 'community_id',
        sourceKey: 'id',
      });
    }
  }
  Community.init(
    {
      pk: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id: {
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      community_pict: {
        type: DataTypes.STRING,
        defaultValue: 'com_pict.jpg',
        allowNull: false,
      },
      privacy: {
        type: DataTypes.ENUM('open', 'closed'),
        defaultValue: 'open',
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
      modelName: 'Community',
      tableName: 'community',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Community;
};
