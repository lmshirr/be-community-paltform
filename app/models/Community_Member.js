'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Community_Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Community_Member.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    CommunityId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "Member"
    },
  }, {
    sequelize,
    modelName: 'Community_Member',
  });
  return Community_Member;
};