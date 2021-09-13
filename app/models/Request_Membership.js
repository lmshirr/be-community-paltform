'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Request_Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Request_Membership.belongsTo(models.User)
        Request_Membership.belongsTo(models.Community)
    }
    };
    Request_Membership.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    CommunityId: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    status: {
        type: DataTypes.STRING,
        allowNull:false,
        defaultValue: "Pending"
    }
    }, {
    sequelize,
    modelName: 'Request_Membership',
    });
    return Request_Membership;
};