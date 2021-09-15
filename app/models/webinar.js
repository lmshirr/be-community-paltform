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
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
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
      ClassId: {
        type: DataTypes.INTEGER,
        references: {model: 'Classes', key:'id'},
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
      } 
  }, {
    sequelize,
    modelName: 'Webinar',
  });
  return Webinar;
};


