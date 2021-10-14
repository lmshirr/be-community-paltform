const db = require('../models/index.js');
const fs = require('fs');
const { Op } = require('sequelize');
require('dotenv').config({ path: '../.env' });

module.exports.addWebinar = function (req, res) {
  // const {title, timezone, start, end, class_id, link, speaker, description} = req.body;
  const { title, timezone, start, end, link, speaker, description } = req.body;
  const { class_id } = req.params;
  const { file } = req;
  console.log(req.body);
  console.log(class_id);
  db.Webinar.create({ title, timezone, start, end, description, class_id, link, speaker, filename: file.filename })
    .then(() => {
      res.status(200).json({
        success: true,
        msg: "webinar added"
      })
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        error: error
      })
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
  try {
    const webinar = await db.Webinar.findAll({
      where: {
        class_id,
      }
    }
    )
    res.status(200).json({
      success: true,
      list: webinar
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error
    })
  }
}

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
