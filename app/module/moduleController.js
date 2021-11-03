const db = require('../shared/db/models');
const fs = require('fs');

module.exports.getModule = async function (req, res) {
  try {
    const module = await db.Module.findByPk(req.params.ModuleId);
    res.status(200).json({
      success: true,
      Module: module,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.addModule = async function (req, res) {
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
    const module = await db.Module.create({
      ClassId,
      filename,
      name,
    });
    res.status(200).json({
      message: 'Module Uploaded',
      data: module,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.editModule = async function (req, res) {
  const { name } = req.body;
  try {
    const module = await db.Module.findByPk(req.params.ModuleId);
    if (req.file) {
      fs.unlinkSync(`./assets/class/modules/${module.filename}`);
      module.update({
        filename: req.file.filename,
      });
    }
    module.update({
      name,
    });
    return res.status(200).json({
      messages: 'Module updated!',
      data: module,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      errors: error,
    });
  }
};

module.exports.deleteModule = async function (req, res) {
  try {
    const module = await db.Module.findByPk(req.params.ModuleId);
    fs.unlinkSync(`./assets/class/modules/${module.filename}`);
    await db.Module.destroy({ where: { id: req.params.ModuleId } });
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
