const db = require('../models/index');
const fs = require('fs');
const { Op } = require('sequelize');
const assessmentService = require('../services/assessmentServices');
const questionService = require('../services/questionServices');
require('dotenv').config({ path: '../.env' });

module.exports.getAssessments = async function (req, res) {
  try {
    const assessments = await assessmentService.getAssessments({ classId: req.params.classId });
    res.status(200).json({
      success: true,
      data: assessments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.getAssessmentDetail = async function (req, res) {
  try {
    const assessment = await assessmentService.getAssessmentDetail(req.params.assessmentId);
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
    const assessment = await assessmentService.createAssessment({
      class_id: classId,
      title,
      description,
      duration,
      question_count: questions.length,
    });

    console.log(assessment);

    let createdQuestions = [];
    questions.forEach((element) => {
      const question = questionService.createQuestion(element, assessment.id);
      createdQuestions.push(question);
    });

    const assessmentQuestions = await assessmentService.getAssessmentDetail(assessment.id);
    console.log(createdQuestions);
    console.log(assessmentQuestions);

    res.status(200).json({
      message: 'Assessment Created',
      data: { ...assessment, questions: createdQuestions },
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
    const assessment = await db.Assessment.findByPk(req.params.assessmentId);
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
    const assessment = await db.Assessment.findByPk(req.params.assessmentId);
    fs.unlinkSync(`./assets/class/modules/${assessment.filename}`);
    await db.Assessment.destroy({ where: { id: req.params.assessmentId } });
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
