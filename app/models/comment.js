'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Community_Post, Community_Member }) {
      Comment.belongsTo(Community_Post, {
        foreignKey: { name: 'post_id' },
        targetKey: 'id',
      });
      Comment.belongsTo(Community_Member, {
        foreignKey: 'member_id',
        targetKey: 'id',
      });
    }
  }
  Comment.init(
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
      member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      comment_uri: {
        type: DataTypes.STRING,
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
      modelName: 'Comment',
      timestamps: false,
      freezeTableName: true,
      tableName: 'comment',
    }
  );
  return Comment;
};
