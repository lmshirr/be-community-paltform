const db = require('../shared/db/models');
const fs = require('fs');

module.exports.getVideo = async function (req, res) {
  try {
    const video = await db.Video.findByPk(req.params.VideoId);
    res.status(200).json({
      success: true,
      Video: video,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.addVideo = async function (req, res) {
  if (!req.file) {
    res.status(200).json({
      success: false,
      message: 'Please select a file',
    });
  }
  const { filename } = req.file;
  const { name } = req.body;
  const { ClassId } = req.params;
  try {
    const video = await db.Video.create({
      ClassId,
      filename,
      name,
    });
    res.status(200).json({
      messages: 'Video Uploaded',
      data: video,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.editVideo = async function (req, res) {
  const { name } = req.body;
  try {
    const video = await db.Video.findByPk(req.params.VideoId);
    if (req.file) {
      fs.unlinkSync(`./assets/class/videos/${video.filename}`);
      video.update({
        filename: req.file.filename,
      });
    }
    video.update({
      name,
    });
    return res.status(200).json({
      messages: 'Video updated!',
      data: video,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.deleteVideo = async function (req, res) {
  try {
    const video = await db.Video.findByPk(req.params.VideoId);
    fs.unlinkSync(`./assets/class/videos/${video.filename}`);
    await db.Video.destroy({ where: { id: req.params.VideoId } });
    return res.status(200).json({
      messages: 'Delete success!',
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      errors: error,
    });
  }
};
