const { Attempt, Question } = require('../models/index');
const { NotFoundException } = require('../utils/httpExceptions');

/**
 * Get all attempts
 *
 * @param {{classId: string}} getAttemptDto
 */
const getAttempts = async (getAttemptDto) => {
  const { classId } = getAttemptDto;

  const attempts = await Attempt.findAll({
    where: { class_id: classId },
    // include: { model: Question, required: true, as: 'questions' },
  });

  return attempts;
};

/**
 * Check if the assessment has been attempted
 *
 * @param {string} assessmentId
 * @param {string} userId
 * @returns attempt
 */
const checkAttempt = async (assessmentId, userId) => {
  const attempt = await Attempt.findOne({
    where: { assessment_id: assessmentId, user_id: userId },
  });

  return attempt;
};

/**
 * Get assessment attempt details
 *
 * @param {string} attemptId
 * @returns attempt
 */
const getAttemptDetail = async (attemptId) => {
  const attempt = await Attempt.findOne({
    where: { id: attemptId },
    // include: { model: AttemptQuestion, as: 'attemptQuestions' },
  });

  return attempt;
};

/**
 * Create a new assessment attempt
 * 
 * @param {{assessment_id: string, user_id: string, total_score: bigint, start_time: Date, finish_time: Date, deadline: Date }} createAttemptDto
 * @param {Question[]} questions
 * @returns {object} assessment
 */
const createAttempt = async (createAttemptDto) => {
  const attempt = await Attempt.create(createAttemptDto);
  return attempt;
};

/**
 *
 * @param {string} attemptId
 * @param {{title: string, description: string, duration: string}} updateAttemptDto
 * @returns attempt
 */
const updateAttempt = async (attemptId, updateAttemptDto) => {
  const attempt = await Attempt.findOne({
    where: { id: attemptId },
  });

  if (!attempt) {
    throw new NotFoundException('Assessment not found');
  }

  await attempt.update(updateAttemptDto);
  return attempt;
};

/**
 *
 * @param {string} attemptId
 * @returns attempt
 */
const deleteAttempt = async (attemptId) => {
  const attempt = await Attempt.destroy({
    where: { id: attemptId },
  });

  return attempt;
};

module.exports = {
  getAttempts,
  getAttemptDetail,
  createAttempt,
  checkAttempt,
  updateAttempt,
  deleteAttempt,
};
