const { Assessment, Question } = require('../models/index');
const {
  BadRequestException,
  NotFoundException,
} = require('../utils/httpExceptions');
const { createQuestion, getQuestions } = require('./questionServices');
const questionServices = require('./questionServices');

/**
 *
 * @param {{classId: string}} getAssessmentDto
 */
const getAssessments = async (getAssessmentDto) => {
  const { classId } = getAssessmentDto;

  const assessments = await Assessment.findAll({
    where: { class_id: classId },
    include: { model: Question, required: true },
  });

  return assessments;
};

/**
 * @param {{title: string, description: string, duration: string}} createAssessmentDto
 * @param {Question[]} questions
 * @returns {object} assessment
 */
const createAssessment = async (createAssessmentDto) => {
  const assessment = await Assessment.create(createAssessmentDto);
  // console.log(assessment);

  // let createQuestion = [];
  // questions.forEach((element) => {
  //   // const question = createQuestion(element, assessment.id);
  //   console.log(element);
  //   const question = questionServices.createQuestion(element, assessment.id);
  //   createQuestion.push(question);
  // });

  // const { id: assessment_id } = assessment;
  // assessment.questions = createQuestion;

  return assessment;
};

/**
 *
 * @param {string} assessmentId
 * @returns assessment
 */
const deleteAssessment = async (assessmentId) => {
  let assessment = await Assessment.findOne({ where: { id: assessmentId } });

  if (!assessment) {
    throw new NotFoundException('Assessment not found');
  }

  assessment = await assessment.destroy();
  return assessment;
};

/**
 *
 * @param {string} id
 * @returns assessment
 */
const getAssessmentDetail = async (assessmentId) => {
  const assessment = await Assessment.findOne({
    where: { id: assessmentId },
    include: { model: Question, required: true, as: 'questions' },
  });

  return assessment;
};

module.exports = {
  getAssessments,
  createAssessment,
  deleteAssessment,
  getAssessmentDetail,
};
