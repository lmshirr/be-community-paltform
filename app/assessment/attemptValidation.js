const Joi = require('joi');

const attemptBodySchemas = {
  createAttempt: Joi.object().keys({
    startTime: Joi.date().required(),
  }),
  completeAttempt: Joi.object().keys({
    finishTime: Joi.date().required(),
    questions: Joi.array()
      .items(
        Joi.object().keys({
          id: Joi.string().required().guid({ version: 'uuidv4' }),
          choosedAnswer: Joi.string().required(),
        })
      )
      .required(),
  }),
};

const attemptParamSchemas = {
  classIdAssessmentIdAttemptId: Joi.object().keys({
    classId: Joi.string().required().guid({ version: 'uuidv4' }),
    assessmentId: Joi.string().required().guid({ version: 'uuidv4' }),
    attemptId: Joi.string().required().guid({ version: 'uuidv4' }),
  }),
};

const attemptQuerySchemas = {};

module.exports = {
  attemptBodySchemas,
  attemptParamSchemas,
  attemptQuerySchemas,
};
