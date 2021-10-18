const { Op } = require('sequelize');
const { Class_Enrollment, Class } = require('../models');
const { ForbiddenException } = require('../utils/httpExceptions');

/**
 *
 * @param {{member_id: string, class_id: string}} createEnrollmentDto
 * @returns {Object} classEnrollment
 */
const createEnrollment = async (createEnrollmentDto) => {
  const { member_id, class_id } = createEnrollmentDto;

  // find is already enroll class ?
  const isAlreadyEnroll = await Class_Enrollment.findOne({
    where: { [Op.and]: [{ member_id }, { class_id }] },
  });

  if (isAlreadyEnroll) {
    throw new ForbiddenException('You already enroll this class');
  }

  const classEnrollment = await Class_Enrollment.create(createEnrollmentDto);

  if (classEnrollment) {
    // increment student in class
    const dataClass = await Class.findOne({ where: { id: class_id } });
    await dataClass.increment('students', { by: 1 });
  }

  return classEnrollment;
};

module.exports = { createEnrollment };
