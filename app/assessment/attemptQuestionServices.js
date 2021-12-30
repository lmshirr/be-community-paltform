const { Attempt_Question } = require('../shared/db/models');
const { NotFoundException } = require('../shared/utils/httpExceptions');

/**
 * Get all attempt questions
 *
 * @param {{attemptId: string}} getAttemptQuestionDto
 */
const getAttemptQuestions = async (getAttemptQuestionDto) => {
  const { attemptId } = getAttemptQuestionDto;

  const attemptQuestions = await Attempt_Question.findAll({
    where: { attempt_id: attemptId },
  });

  return attemptQuestions;
};

/**
 * Get assessment attempt question details
 *
 * @param {string} attemptQuestionId
 * @returns attemptQuestion
 */
const getAttemptQuestionDetail = async (attemptQuestionId) => {
  const attemptQuestion = await Attempt_Question.findOne({
    where: { id: attemptQuestionId },
  });

  return attemptQuestion;
};

/**
 * Create a new assessment attempt question
 *
 * @param {{attempt_id: string, question_id: string, choosed_answer: string, question_score: string }} createAttemptQuestionDto
 * @returns {object} assessment
 */
const createAttemptQuestion = async (createAttemptQuestionDto) => {
  const attempt = await Attempt_Question.create(createAttemptQuestionDto);
  return attempt;
};

/**
 * Update an assessment attempt question
 *
 * @param {string} attemptQuestionId
 * @param {{choosed_answer: string, question_score: string}} updateAttemptQuestionDto
 * @returns attemptQuestion
 */
const updateAttemptQuestion = async (
  attemptQuestionId,
  updateAttemptQuestionDto
) => {
  const attemptQuestion = await Attempt_Question.findOne({
    where: { id: attemptQuestionId },
  });

  if (!attemptQuestion) {
    throw new NotFoundException('Assessment not found');
  }

  await attemptQuestion.update(updateAttemptQuestionDto);
  return attemptQuestion;
};

/**
 * Delete an assessment attempt question
 *
 * @param {string} attemptQuestionId
 * @returns attemptQuestion
 */
const deleteAttemptQuestion = async (attemptQuestionId) => {
  const attemptQuestion = await Attempt_Question.destroy({
    where: { id: attemptQuestionId },
  });

  return attemptQuestion;
};

module.exports = {
  getAttemptQuestions,
  getAttemptQuestionDetail,
  createAttemptQuestion,
  updateAttemptQuestion,
  deleteAttemptQuestion,
};
