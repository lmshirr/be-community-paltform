'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Webinar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Webinar.belongsTo(models.Class);
    }
  };
  Webinar.init({
      pk: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull:false
      },
      speaker: {
        type: DataTypes.STRING,
        allowNull:false
      },
      speaker_job :{
        type : DataTypes.STRING,
        allowNull:false
      },
      class_id: {
        type: DataTypes.UUID,
        references: {model: 'Class', key:'id'},
        onDelete: 'CASCADE',
        allowNull:false
      },
      description: {
        type: DataTypes.STRING,
        allowNull:false 
      },
      date: {
        type: DataTypes.DATE,
        allowNull:false
      },
      time: {
        type: DataTypes.STRING,
        allowNull:false
      },
      link: {
        type: DataTypes.STRING,
        allowNull:false
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
  }, {
    sequelize,
    modelName: 'Webinar',
    freezeTableName: true,
    timestamps: false,
    tableName: 'Webinars'
  });
  return Webinar;
};


