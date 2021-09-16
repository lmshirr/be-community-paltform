"use strict";
const { Sequelize, Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Community, { through: "Community_Member" });
      User.hasMany(models.Community_Post, { onDelete: "cascade" });
      User.hasMany(models.Request_Membership, { onDelete: "cascade" });
      User.hasMany(models.Invitation, { onDelete: "cascade" });
      User.hasMany(models.Comment, { onDelete: "cascade", foreignKey: { name: "user_id" }, as: "user" });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
      activation: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "notActivated",
      },
      profile_pict: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "profile_pict.jpg",
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
      modelName: "User",
    }
  );
  return User;
};
