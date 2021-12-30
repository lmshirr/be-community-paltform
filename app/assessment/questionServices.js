const { Question } = require('../shared/db/models');

/**
 *
 * @param {{assessmentId: string}} getQuestionDto
 */
const getQuestions = async (getQuestionDto) => {
  const { assessmentId } = getQuestionDto;

  const questions = await Question.findAll({
    where: {
      assessment_id: assessmentId,
    },
    // include: {
    //   model: Community_Member,
    //   required: true,
    //   include: User,
    // },
  });

  return questions;
};

/**
 * @param {{description: string, choiceA: string, choiceB: string, choiceC: string, choiceD: string, correctAnswer: string}} createQuestionDto
 * @param {string} assessmentId
 * @returns {object} question
 */
const createQuestion = async (createQuestionDto, assessmentId) => {
  const question = await Question.create({
    assessment_id: assessmentId,
    description: createQuestionDto.description,
    choice_a: createQuestionDto.choiceA,
    choice_b: createQuestionDto.choiceB,
    choice_c: createQuestionDto.choiceC,
    choice_d: createQuestionDto.choiceD,
    correct_answer: createQuestionDto.correctAnswer,
  });

  return question;
};

/**
 * @param {string} questionId
 * @param {{description: string, choiceA: string, choiceB: string, choiceC: string, choiceD: string, correctAnswer: string}} createQuestionDto
 * @param {string} assessmentId
 * @returns {object} question
 */
const updateQuestion = async (questionId, updateQuestionDto, assessmentId) => {
  const question = await Question.findOne({
    where: {
      id: questionId,
      assessment_id: assessmentId,
    },
  });

  if (!question) {
    return null;
  }

  question.description = updateQuestionDto.description;
  question.choice_a = updateQuestionDto.choiceA;
  question.choice_b = updateQuestionDto.choiceB;
  question.choice_c = updateQuestionDto.choiceC;
  question.choice_d = updateQuestionDto.choiceD;
  question.correct_answer = updateQuestionDto.correctAnswer;

  await question.save();

  return question;
};

/**
 *
 * @param {string} questionId
 * @returns assessment
 */
const deleteQuestion = async (questionId) => {
  const question = await Question.destroy({
    where: { id: questionId },
  });

  return question;
};

/**
 *
 * @param {string} id
 * @returns comment
 */
const getQuestionDetail = async (questionId) => {
  const question = await Question.findOne({
    where: { id: questionId },
  });

  return question;
};

module.exports = {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionDetail,
};
