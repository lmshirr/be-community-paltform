const { Module } = require('../shared/db/models');
const { NotFoundException } = require('../shared/utils/httpExceptions');
const { deleteFile } = require('../shared/utils/cloudStorage');
const urlJoin = require('url-join');
const config = require('config');

module.exports = {
    getModule: async (req, res, next) => {
        try {
          const module = await Module.findAll();

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

    getModuleById: async (req, res, next) => {
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

    getModuleByClass: async (req, res, next) => {
        try {
          const module = await Module.findAll({
            where : {class_id : req.params.classId},
            // order: [
            //     ['created_at', 'ASC']
            // ],
          });
      
          if(!module){
            throw new NotFoundException('Module not found in this class');
          }
      
          res.status(200).json({
            success: true,
            data: module,
          });
        } catch (error) {
          return next(error);
        }
    },

    addModule: async (req, res, next) => {
        const { class_id, name } = req.body;
        const { file } = req;
        const bucketUrl = urlJoin(config.get('GCS.bucket_url'));
        let file_uri

        if (file) {
          file_uri = file.filename;
        } else {
          throw new NotFoundException('Please select a file');
        }

        file_uri = urlJoin(bucketUrl, file_uri)

        try {
          const module = await Module.create({
            class_id,
            name,
            file_uri
          });
          res.status(200).json({
            message: 'Module Uploaded',
            data: module,
          });
        } catch (error) {
          return next(error)
        }
    },

    editModule: async (req, res, next) => {
        const { name } = req.body;
        const { file } = req;
        const id = req.params.moduleId;
        const bucketUrl = urlJoin(config.get('GCS.bucket_url'));
        let file_uri
        let dataForm = {}

        try {
          if (file) {
            file_uri = urlJoin(bucketUrl, file.filename)
            dataForm = {...dataForm, file_uri}
          }

          if(name) {
            dataForm = {...dataForm, name}
          }

          if(Object.keys(dataForm).length === 0){
              throw new NotFoundException('Nothing to update');
          }

          let module = await Module.findOne({ where: { id } });

          if(!module){
            throw new NotFoundException('Module not found, cannot update');
          }

          module = (
            await module.update({
              ...dataForm
            })
          ).get({ raw: true });

          if(!module){
            throw new NotFoundException('Cannot update module');
          }

          res.status(200).json({
            message: 'Module updated',
            data: module,
          });
        } catch (error) {
          return next(error)
        }
    },

    deleteModule: async (req, res, next) => {
        const id = req.params.moduleId;

        try {
          const module = await Module.destroy({ where: { id } });

          if (!module) {
            throw new NotFoundException('Module not found');
          }

          return res.status(200).json({
            messages: 'Delete success!',
            data: module,
          });
        }catch (error) {
          return next(error)
        }

        // const bucketUrl = urlJoin(config.get('GCS.bucket_url'));

        // try {
        //   const module = await Module.findOne({
        //     where : {id}
        //   });

        //   const fileName = module.file_uri.replace(bucketUrl + "/", "");
        //   const deleteF = await deleteFile(fileName);
        //   console.log(deleteF);
      
        //   if(!module){
        //     throw new NotFoundException('Module not found');
        //   }

        // } catch (error) {
        //   return next(error);
        // }

    },
}
