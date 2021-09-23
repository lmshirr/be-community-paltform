'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invitation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Community }) {
      Invitation.belongsTo(User, { foreignKey: 'user_id' });
      Invitation.belongsTo(Community, { foreignKey: 'community_id' });
    }
  }
  Invitation.init(
    {
      pk: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      inviter_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'User', key: 'id' },
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'User', key: 'id' },
      },
      community_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'community', key: 'id' },
      },
      status: {
        type: DataTypes.ENUM('pending'),
        allowNull: false,
        defaultValue: 'pending',
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
      modelName: 'Invitation',
      tableName: 'invitation',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Invitation;
};
