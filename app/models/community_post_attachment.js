'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Community_Post_Attachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Community_Post }) {
      Community_Post_Attachment.belongsTo(Community_Post, {
        foreignKey: 'community_post_id',
        targetKey: 'id',
        as: 'post_attachment',
      });
    }
  }
  Community_Post_Attachment.init(
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
      community_post_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Community_Post', key: 'id' },
      },
      filename: {
        type: DataTypes.STRING,
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
      modelName: 'Community_Post_Attachment',
      tableName: 'community_post_attachment',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Community_Post_Attachment;
};
