'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Community_Member_Assessment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Community_Member,
      Assessment,
      Community_Member_Assessment_Question,
    }) {
      Community_Member_Assessment.belongsTo(Community_Member, {
        foreignKey: 'community_member_id',
        targetKey: 'id',
        as: 'community_member',
      });
      Community_Member_Assessment.belongsTo(Assessment, {
        foreignKey: 'assessment_id',
        targetKey: 'id',
        as: 'assessment',
      });
      // Community_Member_Assessment.hasMany(Community_Member_Assessment_Question, {
      //   onDelete: 'cascade',
      //   foreignKey: 'Community_Member_assessment_id',
      //   sourceKey: 'id',
      //   as: 'questions',
      // });
    }
  }
  Community_Member_Assessment.init(
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
      community_member_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Community_Member', key: 'id' },
      },
      assessment_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Assessment', key: 'id' },
      },
      total_score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      finish_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      over_time: {
        type: DataTypes.DATE,
        allowNull: false,
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
      modelName: 'Community_Member_Assessment',
      tableName: 'community_member_assessment',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Community_Member_Assessment;
};
