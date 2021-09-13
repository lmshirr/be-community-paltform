require('dotenv').config({path: '../.env'});
const db = require('../models/index.js');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");


const checkLogin = (req, res, next) =>{
    const token = req.cookies.jwt;
    if(!token){
        return res.status(200).json({
            success: false,
            message: "You aren't logged in"
        })
    }
    next();
}

const checkAdmin = (req, res, next) =>{
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
                {CommunityId: req.params.id},
                {[Op.or]: [
                    {role: 'Owner'},
                    {role: 'Administrator'}
                ]}
                
            ]
        }});
        console.log(role);
        if(!role){
            return res.status(200).json({
                success: false,
                messages: "You dont have permission to this action!"
            })
        }
        next();
    })
}

const checkOwner = (req, res, next) =>{
    const token = req.cookies.jwt;
    jwt.verify(token, process.env.SECRET_KEY, async (error, decodedToken)=>{
        console.log(decodedToken);
        if(error){
            return res.status(200).json({
                success: false,
                message: error
            })
        }
        const role = await db.Community_Member.findOne({where: {
            [Op.and]: [
                {UserId: decodedToken.UserId},
                {CommunityId: req.params.id},
                {role: 'Owner'}
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

module.exports = {checkLogin, checkAdmin, checkOwner}