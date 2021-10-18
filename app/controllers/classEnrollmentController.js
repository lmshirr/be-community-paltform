const classEnrollmentService = require('../services/classEnrollmentService');

const enrollUser = async (req, res, next) => {
  const { id: member_id } = req.member;
  const { id: community_id, classId: class_id } = req.params;

  let classEnrollment;
  try {
    classEnrollment = await classEnrollmentService.createEnrollment({
      community_id,
      member_id,
      class_id,
    });
  } catch (error) {
    return next(error);
  }

  return res.status(201).json({
    message: 'Enroll class success',
    data: classEnrollment,
  });
};

module.exports = { enrollUser };
