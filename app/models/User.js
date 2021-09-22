'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Activation, Community, Request_Membership }) {
      User.hasOne(Activation, { foreignKey: 'user_id' });
      User.belongsToMany(Community, {
        through: 'Community_Member',
        foreignKey: 'user_id',
        uniqueKey: false,
        sourceKey: 'id',
        as: 'user',
      });
      User.hasMany(Request_Membership, {
        onDelete: 'cascade',
        foreignKey: 'user_id',
      });
      // User.belongsToMany(models.Community, { through: 'Community_Member' });
      // User.hasMany(models.Community_Post, { onDelete: 'cascade' });
      // User.hasMany(models.Invitation, { onDelete: 'cascade' });
      // User.hasMany(models.Comment, {
      //   onDelete: 'cascade',
      //   foreignKey: { name: 'user_id' },
      //   as: 'user',
      // });
    }
  }
  User.init(
    {
      pk: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      id: {
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
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
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      profile_pict: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'profile_pict.jpg',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isNumeric: true,
        },
      },
      birthday: {
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
      hooks: {
        beforeCreate: async (user, options) => {
          const salt = await bcrypt.genSalt();
          const encryptedPassword = await bcrypt.hash(user.password, salt);
          user.password = encryptedPassword;
        },
        beforeValidate: (user, options) => {
          user.email = user.email.toLowerCase();
        },
      },
      sequelize,
      modelName: 'User',
      timestamps: false,
      freezeTableName: true,
      tableName: 'user',
    }
  );
  return User;
};
