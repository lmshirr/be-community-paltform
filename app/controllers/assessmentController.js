const db = require('../models/index');
const fs = require('fs');
const { Op } = require('sequelize');
// const assessment = require('../models/assessment.js');
const assessmentService = require('../services/assessmentServices');
require('dotenv').config({ path: '../.env' });

module.exports.getAllAssessment = async function (req, res) {
  try {
    const assessment = await db.Assessment.findByPk(req.params.AssessmentId);
    res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.getAssessment = async function (req, res) {
  try {
    const assessment = await db.Assessment.findByPk(req.params.AssessmentId);
    res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.addAssessment = async function (req, res) {
  const { title, description, duration, questions } = req.body;
  const { classId } = req.params;
  try {
    const assessment = await assessmentService.createAssessment(
      {
        class_id: classId,
        title,
        description,
        duration,
        question_count: questions.length,
      },
      questions
    );

    res.status(200).json({
      message: 'Assessment Created',
      data: assessment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.editAssessment = async function (req, res) {
  const { name } = req.body;
  try {
    const assessment = await db.Assessment.findByPk(req.params.AssessmentId);
    // if (req.file) {
    //   fs.unlinkSync(`./assets/class/modules/${assessment.filename}`)
    //   assessment.update({
    //     filename: req.file.filename,
    //   });
    // }
    module.update({
      name,
    });
    return res.status(200).json({
      messages: 'Module updated!',
      data: module,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.deleteAssessment = async function (req, res) {
  try {
    const assessment = await db.Assessment.findByPk(req.params.AssessmentId);
    fs.unlinkSync(`./assets/class/modules/${assessment.filename}`);
    await db.Assessment.destroy({ where: { id: req.params.AssessmentId } });
    return res.status(200).json({
      messages: 'Delete success!',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: error,
    });
  }
};
