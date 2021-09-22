'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Community_Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Community_Post.belongsTo(models.Community);
      Community_Post.belongsTo(models.User);
      Community_Post.hasMany(models.Community_Post_Attachment, {
        onDelete: 'cascade',
      });
      Community_Post.hasMany(models.Comment, {
        onDelete: 'cascade',
        foreignKey: { name: 'post_id' },
      });
    }
  }
  Community_Post.init(
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
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'User', key: 'id' },
      },
      community_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Community', key: 'id' },
      },
      content: {
        type: DataTypes.TEXT,
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
      modelName: 'Community_Post',
      tableName: 'community_post',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Community_Post;
};
