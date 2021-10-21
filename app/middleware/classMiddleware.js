const { Community_Member, Class, Module, Video, Assessment } = require('../models/index');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { ForbiddenException } = require('../utils/httpExceptions');
const assessmentService = require('../services/assessmentServices');
const classService = require('../services/classServices');

const checkAdmin_community = async (req, res, next) => {
  const { id: user_id } = req.user;
  const { community_id } = req.body;

  const member = await Community_Member.findOne({
    where: {
      [Op.and]: [
        { user_id },
        { community_id },
        { [Op.or]: [{ role: 'owner' }, { role: 'administrator' }] },
      ],
    },
  });
  if (!member) {
    return next(
      new ForbiddenException('You dont have permission to this action!')
    );
  }

  next();
};

const checkAdmin_delete_patch = (req, res, next) => {
  const token = req.cookies.jwt;
  jwt.verify(token, process.env.SECRET_KEY, async (error, decodedToken) => {
    if (error) {
      return res.status(200).json({
        success: false,
        message: error,
      });
    }
    const classDetails = await Class.findByPk(req.params.id);
    const role = await Community_Member.findOne({
      where: {
        [Op.and]: [
          { UserId: decodedToken.UserId },
          { CommunityId: classDetails.CommunityId },
          { [Op.or]: [{ role: 'Owner' }, { role: 'Administrator' }] },
        ],
      },
    });
    if (!role) {
      return res.status(200).json({
        success: false,
        messages: 'You dont have permission to this action!',
      });
    }
    next();
  });
};

const checkAdmin_video_module = (req, res, next) => {
  const token = req.cookies.jwt;
  jwt.verify(token, process.env.SECRET_KEY, async (error, decodedToken) => {
    if (error) {
      return res.status(200).json({
        success: false,
        message: error,
      });
    }
    // const classDetails = await Class.findByPk(req.params.classId);
    const classDetails = await Class.findOne({
      where: {
        id: req.params.classId,
      },
    });
    const role = await Community_Member.findOne({
      where: {
        [Op.and]: [
          { user_id: decodedToken.id },
          { community_id: classDetails.community_id },
          { [Op.or]: [{ role: 'owner' }, { role: 'administrator' }] },
        ],
      },
    });
    if (!role) {
      return res.status(200).json({
        success: false,
        messages: 'You dont have permission to this action!',
      });
    }
    next();
  });
};

const checkMembership = (req, res, next) => {
  const token = req.cookies.jwt;
  jwt.verify(token, process.env.SECRET_KEY, async (error, decodedToken) => {
    if (error) {
      return res.status(200).json({
        success: false,
        message: error,
      });
    }
    let classDetails;
    if (req.url.includes('module')) {
      const module = await Module.findByPk(req.params.ModuleId);
      classDetails = await Class.findByPk(module.ClassId);
    } else if (req.url.includes('video')) {
      const video = await Video.findByPk(req.params.VideoId);
      classDetails = await Class.findByPk(video.ClassId);
    } else if (req.url.includes('assessments')) {
      const assessment = await assessmentService.getAssessmentDetail(req.params.AssessmentId);
      classDetails = await classService.getClassDetail(assessment.class_id);
    } else {
      classDetails = await Class.findByPk(req.params.id);
    }
    console.log(decodedToken);

    const checkMember = await Community_Member.findOne({
      where: {
        [Op.and]: [
          { user_id: decodedToken.id },
          { community_id: classDetails.community_id },
        ],
      },
    });
    if (!checkMember) {
      return res.status(200).json({
        success: false,
        messages: 'You must be a member to view this content!',
      });
    }
    next();
  });
};

module.exports = {
  checkAdmin_community,
  checkAdmin_delete_patch,
  checkAdmin_video_module,
  checkMembership,
};
