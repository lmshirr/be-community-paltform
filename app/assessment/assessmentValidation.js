const Joi = require('joi');

const assessmentBodySchemas = {
  createAssessment: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    duration: Joi.number().integer().required(),
    questions: Joi.array()
      .items(
        Joi.object().keys({
          description: Joi.string().required(),
          choiceA: Joi.string().required(),
          choiceB: Joi.string().required(),
          choiceC: Joi.string().required(),
          choiceD: Joi.string().required(),
          correctAnswer: Joi.string().required(),
        })
      )
      .required(),
  }),
  updateAssessment: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    duration: Joi.number().integer().required(),
    questions: Joi.array()
      .items(
        Joi.object().keys({
          id: Joi.string().required().guid({ version: 'uuidv4' }),
          description: Joi.string().required(),
          choiceA: Joi.string().required(),
          choiceB: Joi.string().required(),
          choiceC: Joi.string().required(),
          choiceD: Joi.string().required(),
          correctAnswer: Joi.string().required(),
        })
      )
      .required(),
  }),
};

const assessmentParamSchemas = {
  classId: Joi.string().required().guid({ version: 'uuidv4' }),
  classIdAssessmentId: Joi.object().keys({
    classId: Joi.string().required().guid({ version: 'uuidv4' }),
    assessmentId: Joi.string().required().guid({ version: 'uuidv4' }),
  }),
};

const assessmentQuerySchemas = {};

module.exports = {
  assessmentBodySchemas,
  assessmentParamSchemas,
  assessmentQuerySchemas,
};
