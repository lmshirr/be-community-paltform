const db = require('../models/index.js');
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
require("dotenv").config({ path: "../.env" });

module.exports.getCommunityPosts = async function(req, res){
    const{CommunityId} = req.params
    try{
        const post = await db.Community_Post.findAll({
            where:{
                CommunityId: CommunityId
            }
        })
        return res.status(200).json({
            data: post
        })
    }catch(error){
        return res.status(200).json({
            success:false,
            errors: error
        })
    }
}

module.exports.getPostDetails = async function(req, res){
    try{
        const post = await db.Community_Post.findByPk(req.params.id,{
            include: [{
                model: db.User,
                attributes:[
                    "id",
                    "name",
                    "profile_pict"
                ]
            }],
            include: [{
                model: db.Community_Post_Attachment,
                attributes:[
                    "id",
                    "filename",
                ]
            }],
        });
        return res.status(200).json({
            data: post
        })
    }catch(error){
        return res.status(200).json({
            success:false,
            errors: error
        })
    }
}

module.exports.createPost = async function(req, res){
    const {
        CommunityId,
        content
    } = req.body;
    try{
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const UserId = decoded.UserId;
        const post = await db.Community_Post.create({
            CommunityId,
            UserId,
            content
        });
        if(req.files){
            CommunityPostId = post.id;
            req.files.forEach(async function(file) {
                filename = file.filename
                try{
                    await db.Community_Post_Attachment.create({
                        CommunityPostId,
                        filename
                    })
                }catch(error){
                    console.log(error);
                    return res.status(200).json({
                        success:false,
                        errors: error
                    })
                }
            });
        }
        res.status(201).json({
            messages: "Post created",
            data: post
        })
    }catch(error){
        if(error.name === "SequelizeValidationError"){
            return res.status(200).json({
                success:false,
                errors: error.errors.map((e)=>{
                    return{
                        attribute: e.path,
                        message: e.message
                    };
                })
            })
        }else{
            console.log(error);
            return res.status(200).json({
                success:false,
                errors: error
            })
        };
    }
}

module.exports.editPost = async function(req, res){
    const {
        id
    } = req.params;
    const {
        content
    } = req.body;
    try{
        const post = await db.Community_Post.findByPk(id);
        post.update({
            content: content
        })
        if(req.files){
            CommunityPostId = id;
            req.files.forEach(async function(file) {
                filename = file.filename
                try{
                    await db.Community_Post_Attachment.create({
                        CommunityPostId,
                        filename
                    })
                }catch(error){
                    console.log(error);
                    return res.status(200).json({
                        success:false,
                        errors: error
                    })
                }
            });
        }
        return res.status(200).json({
            messages: "Post updated!",
            data: post
        })
    }catch(error){
        console.log(error);
        return res.status(200).json({
            success:false,
            errors: error
        })
    }
}

module.exports.deletePost = async function(req, res){
    const {id} = req.params
    try{
        await db.Community_Post.destroy({where: {id: id}})
        return res.status(200).json({
            success: true,
            messages: "Delete success!"
        })
    }catch(error){
        console.log(error);
        return res.status(200).json({
            success:false,
            errors: error
        })
    }
}

module.exports.deleteAttachment = async function(req, res){
    const {id} = req.params
    try{
        await db.Community_Post_Attachment.destroy({where: {id: id}})
        return res.status(200).json({
            success: true,
            messages: "Delete success!"
        })
    }catch(error){
        console.log(error);
        return res.status(200).json({
            success:false,
            errors: error
        })
    }
}