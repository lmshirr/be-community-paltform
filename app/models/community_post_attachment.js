'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Community_Post_Attachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Community_Post_Attachment.belongsTo(models.Community_Post)
    }
  };
  Community_Post_Attachment.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    CommunityPostId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    filename: {
      type: DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Community_Post_Attachment',
  });
  return Community_Post_Attachment;
};