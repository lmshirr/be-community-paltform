/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const attemptService = require('../services/attemptServices');
const assessmentService = require('../services/assessmentServices');
const questionService = require('../services/questionServices');
const attemptQuestionService = require('../services/attemptQuestionServices');
require('dotenv').config({ path: '../.env' });

module.exports.getAttempts = async (req, res) => {
  try {
    const attempts = await attemptService.getAttempts({ assessmentId: req.params.assessmentId });
    res.status(200).json({
      success: true,
      data: attempts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.getAttemptDetail = async (req, res) => {
  try {
    const attempt = await attemptService.getAttemptDetail(req.params.attemptId);
    res.status(200).json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.addAttempt = async (req, res) => {
  const { startTime } = req.body;
  const { assessmentId } = req.params;
  const { userId } = res.locals;

  try {
    // check if user has already attempt this assessment
    await attemptService.checkAttempt(assessmentId, userId);

    // calculate deadline data based on assessment duration
    const assessment = await assessmentService.getAssessmentDetail(assessmentId);
    const deadline = new Date(startTime + assessment.duration * 60 * 1000);

    const attempt = await attemptService.createAttempt({
      assessment_id: assessmentId,
      user_id: userId,
      total_score: 0,
      start_time: startTime,
      finish_time: startTime,
      deadline,
    });

    // get inserted attempt data
    const attemptQuestions = await attemptService.getAttemptDetail(attempt.id);

    res.status(200).json({
      message: 'Attempt attempted',
      data: attemptQuestions,
    });
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({
        success: false,
        errors: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.completeAttempt = async (req, res) => {
  const { attemptId } = req.params;
  const { finishTime, questions } = req.body;
  try {
    // check if finish time equal to start time or exceed deadline
    let attempt = await attemptService.getAttemptDetail(attemptId);
    if (attempt.deadline < new Date(finishTime)) {
      return res.status(400).json({
        success: false,
        errors: 'Finish time exceed deadline',
      });
    }
    if (attempt.start_time !== attempt.finish_time) {
      return res.status(400).json({
        success: false,
        errors: 'You have already completed this attempt',
      });
    }
    // add attempt question
    let totalScore = 0;
    for (let i = 0; i < questions.length; i++) {
      // check if choosed answer is correct
      const question = await questionService.getQuestionDetail(questions[i].id);
      if (question.correct_answer === questions[i].choosedAnswer) {
        questions[i].score = 10;
      } else {
        questions[i].score = 0;
      }

      await attemptQuestionService.createAttemptQuestion({
        attempt_id: attemptId,
        question_id: questions[i].id,
        choosed_answer: questions[i].choosedAnswer,
        question_score: questions[i].score,
      });

      totalScore += questions[i].score;
    }

    await attemptService.updateAttempt(attemptId, {
      total_score: totalScore,
      finish_time: finishTime,
    });

    attempt = await attemptService.getAttemptDetail(attemptId);

    return res.status(200).json({
      messages: 'Attempt completed!',
      data: attempt,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.editAttempt = async (req, res) => {
  const { title, description, duration, questions } = req.body;
  try {
    const attempt = await attemptService.updateAttempt(req.params.attemptId, {
      title,
      description,
      duration,
    });

    // update question
    for (let i = 0; i < questions.length; i++) {
      let question = await questionService.updateQuestion(
        questions[i].id,
        questions[i],
        attempt.id
      );
      if (!question) {
        question = await questionService.createQuestion(questions[i], attempt.id);
      }
    }

    // get updated attempt data
    const attemptQuestions = await attemptService.getAttemptDetail(attempt.id);

    return res.status(200).json({
      messages: 'Attempt updated!',
      data: attemptQuestions,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.deleteAttempt = async (req, res) => {
  const { attemptId: id } = req.params;
  try {
    const attempt = await attemptService.deleteAttempt(id);

    return res.status(200).json({
      messages: 'Delete success!',
      data: attempt,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: error,
    });
  }
};
