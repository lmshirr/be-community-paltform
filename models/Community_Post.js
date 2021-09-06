'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Community_Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Community_Post.belongsTo(models.Community)
      Community_Post.belongsTo(models.User)
      Community_Post.hasMany(models.Community_Post_Attachment, {onDelete: 'cascade'})
    }
  };
  Community_Post.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: {
      type: DataTypes.INTEGER,
    },
    CommunityId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Community_Post',
  });
  return Community_Post;
};