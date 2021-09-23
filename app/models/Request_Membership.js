'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Request_Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Community }) {
      Request_Membership.belongsTo(User, { foreignKey: 'user_id' });
      Request_Membership.belongsTo(Community, { foreignKey: 'community_id' });
    }
  }
  Request_Membership.init(
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
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      community_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'refused'),
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
      modelName: 'Request_Membership',
      freezeTableName: true,
      tableName: 'request_membership',
      timestamps: false,
    }
  );
  return Request_Membership;
};
