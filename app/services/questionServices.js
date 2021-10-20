const { Question } = require('../models');
const { NotFoundException } = require('../utils/httpExceptions');

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
    ...createQuestionDto,
  });

  return question;
};

/**
 *
 * @param {string} questionId
 * @returns assessment
 */
const deleteQuestion = async (questionId) => {
  let question = await Question.findOne({ where: { id: questionId } });

  if (!question) {
    throw new NotFoundException('Question not found');
  }

  question = await question.destroy();

  return question;
};

/**
 *
 * @param {string} id
 * @returns comment
 */
const getQuestionDetail = async (id) => {
  const comment = await Question.findOne({
    where: { id },
    // include: { model: Community_Member, include: User },
  });

  return comment;
};

module.exports = {
  getQuestions,
  createQuestion,
  deleteQuestion,
  getQuestionDetail,
};
