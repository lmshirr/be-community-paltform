const { Module } = require('../shared/db/models');
const { NotFoundException } = require('../shared/utils/httpExceptions');
const fs = require('fs');

module.exports = {
    getModule: async (req, res) => {
        try {
          const module = await Module.findAll();
          res.status(200).json({
            success: true,
            data: module,
          });
        } catch (error) {
          return res.status(200).json({
            success: false,
            errors: error,
          });
        }
    },

    getModuleById: async (req, res) => {
        try {
          const module = await Module.findOne({
            where : {id : req.params.moduleId}
          });
      
          if(!module){
            throw new NotFoundException('Module not found');
          }
      
          res.status(200).json({
            success: true,
            data: module,
          });
        } catch (error) {
          return next(error);
        }
    },

    getModuleByClass: async (req, res) => {
        try {
          const module = await Module.findAll({
            where : {class_id : req.params.classId}
          });
      
          if(!module){
            throw new NotFoundException('Module not found');
          }
      
          res.status(200).json({
            success: true,
            data: module,
          });
        } catch (error) {
          return next(error);
        }
    },

    addModule: async (req, res) => {
        // if (!req.file) {
        //   res.status(200).json({
        //     success: false,
        //     message: 'Please select a file',
        //   });
        // }
        // const { filename } = req.file;
        const { class_id, filename, name } = req.body;
        // const { ClassId } = req.params;
        
        try {
          const module = await Module.create({
            class_id : class_id,
            filename: filename,
            name : name,
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
    },

    editModule: async (req, res) => {
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
    },

    deleteModule: async (req, res) => {
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
    },
}
