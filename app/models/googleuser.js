'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GoogleUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Community,
      Request_Membership,
      Invitation,
      Community_Post,
    }) {
      // GoogleUser.belongsToMany(Community, {
      //   through: 'Community_Member',
      //   foreignKey: 'user_id',
      //   uniqueKey: false,
      //   sourceKey: 'id',
      //   as: 'user',
      // });
      GoogleUser.hasMany(Request_Membership, {
        onDelete: 'cascade',
        foreignKey: 'user_id',
      });
      GoogleUser.hasMany(Invitation, { onDelete: 'cascade', foreignKey: 'user_id' });
      GoogleUser.hasMany(Community_Post, {
        onDelete: 'cascade',
        foreignKey: 'user_id',
      });
      // GoogleUser.hasMany(models.Comment, {
      //   onDelete: 'cascade',
      //   foreignKey: { name: 'user_id' },
      //   as: 'user',
      // });
    }
  }
  GoogleUser.init(
    {
      pk: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      google_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      verified_email: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      given_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      family_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      locale: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hd: {
        type: DataTypes.STRING,
        defaultValue: null,
        allowNull: true,
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
      modelName: 'GoogleUser',
      timestamps: false,
      freezeTableName: true,
      tableName: 'google_user',
    }
  );
  return GoogleUser;
};