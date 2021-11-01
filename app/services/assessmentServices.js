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
 * @param {{class_id: string, title: string, description: string, duration: string}} createAssessmentDto
 * @returns {object} assessment
 */
const createAssessment = async (createAssessmentDto) => {
  const assessment = await Assessment.create(createAssessmentDto);
  return assessment;
};

/**
 *
 * @param {string} assessmentId
 * @param {{title: string, description: string, duration: string}} updateAssessmentDto
 * @returns assessment
 */
const updateAssessment = async (assessmentId, updateAssessmentDto) => {
  const assessment = await Assessment.findOne({
    where: { id: assessmentId },
  });

  if (!assessment) {
    throw new NotFoundException('Assessment not found');
  }

  await assessment.update(updateAssessmentDto);
  return assessment;
};

/**
 *
 * @param {string} assessmentId
 * @returns assessment
 */
const deleteAssessment = async (assessmentId) => {
  const assessment = await Assessment.destroy({
    where: { id: assessmentId },
  });

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
    include: { model: Question, as: 'questions' },
  });

  return assessment;
};

module.exports = {
  getAssessments,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  getAssessmentDetail,
};
