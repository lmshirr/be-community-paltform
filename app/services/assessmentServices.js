const { Assessment, Question } = require('../models/index');
const { NotFoundException } = require('../utils/httpExceptions');

/**
 *
 * @param {{classId: string}} getAssessmentDto
 */
const getAssessments = async (getAssessmentDto) => {
  const { classId } = getAssessmentDto;

  const assessments = await Assessment.findAll({
    where: { class_id: classId },
    // include: { model: Question, required: true, as: 'questions' },
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
