/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const attemptService = require('../services/attemptServices');
const assessmentService = require('../services/assessmentServices');
const questionService = require('../services/questionServices');
require('dotenv').config({ path: '../.env' });

module.exports.getAttempts = async (req, res) => {
  try {
    const attempts = await attemptService.getAttempts({ classId: req.params.classId });
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
  const { start_time } = req.body;
  const { assessmentId } = req.params;
  const { userId } = res.locals;

  try {
    // check if user has already attempt this assessment
    const userAttempt = await attemptService.checkAttempt(assessmentId, userId);
    if (userAttempt) throw new Error('Attempt already exists');
    console.log(start_time);

    // calculate deadline data based on assessment duration
    const assessment = await assessmentService.getAssessmentDetail(assessmentId);
    const deadline = new Date(Date.now() + assessment.duration * 60 * 1000);

    const attempt = await attemptService.createAttempt({
      assessment_id: assessmentId,
      user_id: userId,
      total_score: 0,
      start_time,
      finish_time: start_time,
      deadline,
    });

    // // insert question to db
    // for (let i = 0; i < questions.length; i++) {
    //   const question = await questionService.createQuestion(
    //     questions[i],
    //     attempt.id
    //   );
    // }

    // get inserted attempt data
    const attemptQuestions = await attemptService.getAttemptDetail(attempt.id);
    console.log(attemptQuestions);
    console.log("----------------------------------");

    res.status(200).json({
      message: 'Attempt attempted',
      data: attemptQuestions,
    });
  } catch (error) {
    if (error.message === 'Attempt already exists')
      return res.status(400).json({
        success: false,
        errors: 'You have already attempt this assessment',
      });

    return res.status(500).json({
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
