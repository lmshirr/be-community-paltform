const db = require('../shared/db/models');
const fs = require('fs');
const { Op } = require('sequelize');
require('dotenv').config({ path: '../.env' });

module.exports.addWebinar = function (req, res) {
  const {
    title,
    timezone,
    start,
    end,
    link,
    speaker,
    description,
    filename_thumbnail,
    filename_dp,
  } = req.body;
  const { class_id } = req.params;
  const { file } = req;
  console.log(req.body);
  console.log(class_id);
  const path =
    process.env.NODE_ENV === 'production'
      ? process.env.PRODUCTION_URL
      : process.env.LOCALHOST_URL;
  const file_url_thumbnail = `${path}/assets/werbinar_thumbnail_pict/${filename_thumbnail}`;
  const file_url_dp = `${path}/assets/werbinar_dp_pict/${filename_dp}`;
  db.Webinar.create({
    title,
    timezone,
    start,
    end,
    description,
    class_id,
    link,
    speaker,
    filename_thumbnail: file_url_thumbnail,
    filename_dp: file_url_dp,
  })
    .then(() => {
      res.status(200).json({
        success: true,
        msg: 'webinar added',
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        error: error,
      });
    });
};

module.exports.getWebinar = async function (req, res) {
  try {
    const { id } = req.params;
    const webinar = await db.Webinar.findOne({ where: { id } });
    res.status(200).json({
      success: true,
      webinar: webinar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error,
    });
  }
};

module.exports.showWebinar = async function (req, res) {
  const { class_id } = req.params;
  const { page } = req.query;
  try {
    const webinar = await db.Webinar.findAll({
      where: {
        class_id,
      },
      offset: (page - 1) * 5,
      limit: 5,
      order: [['start']],
    });
    const total = await db.Webinar.count();
    res.status(200).json({
      success: true,
      list: webinar,
      total: total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error,
    });
  }
};

module.exports.deleteWebinar = function (req, res) {
  db.Webinar.destroy({ where: { id: req.params.webinarId } }).then(() => {
    res
      .status(200)
      .json({
        success: true,
        msg: 'Webinar deleted',
      })
      .catch((error) => {
        res.status(500).json({
          success: false,
          error: error,
        });
      });
  });
};

module.exports.editWebinar = async function (req, res) {
  try {
    const webinar = await db.Webinar.findByPk(req.params.webinarId);
    const { name, speaker, speaker_job, description, date, time, link } =
      req.body;
    console.log(webinar);
    webinar.update({
      name: name,
    });
    res.status(200).json({
      success: true,
      webinar: webinar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};
