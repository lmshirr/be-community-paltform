'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Webinar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Class }) {
      // define association here
      Webinar.belongsTo(Class, { foreignKey: 'class_id' });
    }
  }
  Webinar.init(
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
        allowNull: true,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timezone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      speaker: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      visibility: {
        type: DataTypes.ENUM('open', 'closed'),
        allowNull: false,
        defaultValue: 'open',
      },
      class_id: {
        type: DataTypes.UUID,
        references: { model: 'class', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filename_thumbnail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      filename_dp: {
        type: DataTypes.STRING,
        allowNull: true,
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
      modelName: 'Webinar',
      freezeTableName: true,
      timestamps: false,
      tableName: 'Webinars',
    }
  );
  return Webinar;
};

// id: {
//   type: DataTypes.UUID,
//   defaultValue: DataTypes.UUIDV4,
//   allowNull: true,
//   unique: true,
// },
// name: {
//   type: DataTypes.STRING,
//   allowNull:false
// },
// speaker: {
//   type: DataTypes.STRING,
//   allowNull:false
// },
// speaker_job :{
//   type : DataTypes.STRING,
//   allowNull:false
// },
// class_id: {
//   type: DataTypes.UUID,
//   references: {model: 'Class', key:'id'},
//   onDelete: 'CASCADE',
//   allowNull:false
// },
// description: {
//   type: DataTypes.STRING,
//   allowNull:false
// },
// date: {
//   type: DataTypes.DATE,
//   allowNull:false
// },
// time: {
//   type: DataTypes.STRING,
//   allowNull:false
// },
// link: {
//   type: DataTypes.STRING,
//   allowNull:false
// },
// created_at: {
//   allowNull: false,
//   type: DataTypes.DATE,
//   defaultValue: DataTypes.NOW,
// },
// updated_at: {
//   allowNull: false,
//   type: DataTypes.DATE,
//   defaultValue: DataTypes.NOW,
// },
