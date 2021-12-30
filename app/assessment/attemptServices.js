const { Attempt, Attempt_Question } = require('../shared/db/models');
const {
  NotFoundException,
  BadRequestException,
} = require('../shared/utils/httpExceptions');

/**
 * Get all attempts
 *
 * @param {{assessmentId: string}} getAttemptDto
 */
const getAttempts = async (getAttemptDto) => {
  const { assessmentId } = getAttemptDto;

  const attempts = await Attempt.findAll({
    where: { assessment_id: assessmentId },
    include: { model: Attempt_Question, as: 'questions' },
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

  if (attempt) {
    throw new BadRequestException('You have already attempted this assessment');
  }

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
    include: { model: Attempt_Question, as: 'questions' },
  });
  // console.log(attempt);

  return attempt;
};

/**
 * Create a new assessment attempt
 *
 * @param {{assessment_id: string, user_id: string, total_score: bigint, start_time: Date, finish_time: Date, deadline: Date }} createAttemptDto
 * @returns {object} assessment
 */
const createAttempt = async (createAttemptDto) => {
  const attempt = await Attempt.create(createAttemptDto);
  return attempt;
};

/**
 *
 * @param {string} attemptId
 * @param {{ total_score: bigint, finish_time: Date }} updateAttemptDto
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
