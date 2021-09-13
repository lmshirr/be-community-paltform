require('dotenv').config({path: '../.env'});
const db = require('../models/index.js');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");

const checkUser_delete_patch = (req, res, next) =>{
    const token = req.cookies.jwt;
    jwt.verify(token, process.env.SECRET_KEY, async (error, decodedToken)=>{
        if(error){
            return res.status(200).json({
                success: false,
                message: error
            })
        }
        const post = await db.Community_Post.findByPk(req.params.id);
        if(decodedToken.UserId != post.UserId){
            return res.status(200).json({
                success: false,
                message: "You dont have permission to this action!"
            })
        }
        next();
    })
}

const checkMembership_post = (req, res, next)=>{
    const token = req.cookies.jwt;
    const {CommunityId} = req.body;
    jwt.verify(token, process.env.SECRET_KEY, async (error, decodedToken)=>{
        if(error){
            return res.status(200).json({
                success: false,
                message: error
            })
        }
        const checkMember = await db.Community_Member.findOne( {where:{
            [Op.and]: [
                {UserId: decodedToken.UserId},
                {CommunityId: CommunityId},
            ]
        }} );
        if(!checkMember){
            return res.status(200).json({
                success: false,
                messages: "You are not a member of this community!"
            })
        }
        next();
    })
}

module.exports = {checkUser_delete_patch, checkMembership_post}