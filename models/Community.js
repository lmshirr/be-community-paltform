'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Community extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Community.belongsToMany(models.User, {through: 'Community_Member', onDelete: 'cascade'})
      Community.hasMany(models.Community_Post, {onDelete: 'cascade'});
      Community.hasMany(models.Request_Membership, {onDelete: 'cascade'});
      Community.hasMany(models.Invitation, {onDelete: 'cascade'});
    }
  };
  Community.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull:false
    },
    type: {
      type: DataTypes.STRING,
      allowNull:false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull:false
    },
    community_pict: {
      type: DataTypes.STRING,
      defaultValue: "com_pict.jpg",
      allowNull:false
    },
    privacy: {
      type: DataTypes.STRING,
      defaultValue: "Open",
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Community',
  });
  return Community;
};