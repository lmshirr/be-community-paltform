require('dotenv').config({path: '../.env'});
const db = require('../models/index.js');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");

const checkAdmin_post = (req, res, next) =>{
    const token = req.cookies.jwt;
    jwt.verify(token, process.env.SECRET_KEY, async (error, decodedToken)=>{
        if(error){
            return res.status(200).json({
                success: false,
                message: error
            })
        }
        const role = await db.Community_Member.findOne({where: {
            [Op.and]: [
                {UserId: decodedToken.UserId},
                {CommunityId: req.body.CommunityId},
                {[Op.or]: [
                    {role: 'Owner'},
                    {role: 'Administrator'}
                ]}
                
            ]
        }});
        if(!role){
            return res.status(200).json({
                success: false,
                messages: "You dont have permission to this action!"
            })
        }
        next();
    })
}

const checkAdmin_delete_patch = (req, res, next)=>{
    const token = req.cookies.jwt;
    jwt.verify(token, process.env.SECRET_KEY, async (error, decodedToken)=>{
        if(error){
            return res.status(200).json({
                success: false,
                message: error
            })
        }
        const classDetails = await db.Class.findByPk(req.params.id);
        const role = await db.Community_Member.findOne({where: {
            [Op.and]: [
                {UserId: decodedToken.UserId},
                {CommunityId: classDetails.CommunityId},
                {[Op.or]: [
                    {role: 'Owner'},
                    {role: 'Administrator'}
                ]}
                
            ]
        }});
        if(!role){
            return res.status(200).json({
                success: false,
                messages: "You dont have permission to this action!"
            })
        }
        next();
    })
}

const checkAdmin_video_module = (req, res, next)=>{
    const token = req.cookies.jwt;
    jwt.verify(token, process.env.SECRET_KEY, async (error, decodedToken)=>{
        if(error){
            return res.status(200).json({
                success: false,
                message: error
            })
        }
        const classDetails = await db.Class.findByPk(req.params.ClassId);
        const role = await db.Community_Member.findOne({where: {
            [Op.and]: [
                {UserId: decodedToken.UserId},
                {CommunityId: classDetails.CommunityId},
                {[Op.or]: [
                    {role: 'Owner'},
                    {role: 'Administrator'}
                ]}
                
            ]
        }});
        if(!role){
            return res.status(200).json({
                success: false,
                messages: "You dont have permission to this action!"
            })
        }
        next();
    })
}

const checkMembership = (req, res, next)=>{
    const token = req.cookies.jwt;
    jwt.verify(token, process.env.SECRET_KEY, async (error, decodedToken)=>{
        if(error){
            return res.status(200).json({
                success: false,
                message: error
            })
        }
        let classDetails;
        if(req.url.includes('module')){
            const module = await db.Module.findByPk(req.params.ModuleId)
            classDetails = await db.Class.findByPk(module.ClassId);
        }else if(req.url.includes('video')){
            const video = await db.Video.findByPk(req.params.VideoId)
            classDetails = await db.Class.findByPk(video.ClassId);
        }else{
            classDetails = await db.Class.findByPk(req.params.id);
        }
        const checkMember = await db.Community_Member.findOne( {where:{
            [Op.and]: [
                {UserId: decodedToken.UserId},
                {CommunityId: classDetails.CommunityId},
            ]
        }} );
        if(!checkMember){
            return res.status(200).json({
                success: false,
                messages: "You must be a member to view this content!"
            })
        }
        next();
    })
}

module.exports = {checkAdmin_post, checkAdmin_delete_patch, checkAdmin_video_module, checkMembership}