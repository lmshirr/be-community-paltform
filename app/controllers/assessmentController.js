/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const assessmentService = require('../services/assessmentServices');
const questionService = require('../services/questionServices');
require('dotenv').config({ path: '../.env' });

module.exports.getAssessments = async (req, res) => {
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

module.exports.getAssessmentDetail = async (req, res) => {
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

module.exports.addAssessment = async (req, res) => {
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

    // insert question to db
    for (let i = 0; i < questions.length; i++) {
      const question = await questionService.createQuestion(
        questions[i],
        assessment.id
      );
    }

    // get inserted assessment data
    const assessmentQuestions = await assessmentService.getAssessmentDetail(assessment.id);

    res.status(200).json({
      message: 'Assessment Created',
      data: assessmentQuestions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.editAssessment = async (req, res) => {
  const { title, description, duration, questions } = req.body;
  try {
    const assessment = await assessmentService.updateAssessment(
      req.params.assessmentId,
      { title, description, duration }
    );

    // update question
    for (let i = 0; i < questions.length; i++) {
      let question = await questionService.updateQuestion(
        questions[i].id,
        questions[i],
        assessment.id
      );
      if (!question) {
        question = await questionService.createQuestion(questions[i], assessment.id);
      }
    }

    // get updated assessment data
    const assessmentQuestions = await assessmentService.getAssessmentDetail(assessment.id);

    return res.status(200).json({
      messages: 'Assessment updated!',
      data: assessmentQuestions,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.deleteAssessment = async (req, res) => {
  const { assessmentId: id } = req.params;
  let assessment;
  try {
    assessment = await assessmentService.deleteAssessment(id);

    return res.status(200).json({
      messages: 'Delete success!',
      data: assessment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: error,
    });
  }
};
