'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Community_Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Community,
      Community_Member,
      Community_Post_Attachment,
      Comment,
    }) {
      Community_Post.belongsTo(Community, { foreignKey: 'community_id' });
      Community_Post.belongsTo(Community_Member, {
        foreignKey: 'member_id',
        targetKey: 'id',
      });
      Community_Post.hasMany(Community_Post_Attachment, {
        onDelete: 'cascade',
        foreignKey: 'community_post_id',
        sourceKey: 'id',
      });
      Community_Post.hasMany(Comment, {
        onDelete: 'cascade',
        foreignKey: { name: 'post_id' },
        sourceKey: 'id',
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
      member_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Community_Member', key: 'id' },
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
