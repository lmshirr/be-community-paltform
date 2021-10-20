const { Assessment, Question } = require('../models');
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
    where: {
      class_id: classId,
    },
    include: {
      model: Question,
      required: true,
      // include: User,
    },
  });

  return assessments;
};

/**
 * @param {{title: string, description: string, duration: string}} createAssessmentDto
 * @param {Question[]} questions
 * @returns {object} assessment
 */
const createAssessment = async (createAssessmentDto, questions) => {
  const assessment = await Assessment.create(createAssessmentDto);

  let createQuestion = [];
  questions.forEach((element) => {
    // const question = createQuestion(element, assessment.id);
    const question = questionServices.createQuestion(element, assessment.id);
    createQuestion.push(question);
  });

  // const { id: assessment_id } = assessment;
  assessment.questions = createQuestion;
  console.log(assessment);

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
 * @returns comment
 */
const getAssessmentDetail = async (id) => {
  const comment = await Assessment.findOne({
    where: { id },
    include: { model: Community_Member, include: User },
  });

  return comment;
};

module.exports = {
  getAssessments,
  createAssessment,
  deleteAssessment,
  getAssessmentDetail,
};
