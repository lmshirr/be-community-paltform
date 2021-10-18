'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Class_Enrollment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Community_Member, Class }) {
      Class_Enrollment.belongsTo(Community_Member, {
        foreignKey: 'member_id',
        sourceKey: 'id',
      });
      Class_Enrollment.belongsTo(Class, {
        foreignKey: 'class_id',
        sourceKey: 'id',
      });
    }
  }
  Class_Enrollment.init(
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
      class_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Class', key: 'id' },
      },
      member_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Community_Member', key: 'id' },
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
      modelName: 'Class_Enrollment',
      tableName: 'class_enrollment',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Class_Enrollment;
};
