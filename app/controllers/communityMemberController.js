const db = require('../models/index.js');
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const bcrypt =require('bcrypt');
require("dotenv").config({ path: "../.env" });

module.exports.joinCommunity = async function(req, res){
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const UserId = decoded.UserId;
    const CommunityId = req.body.CommunityId;
    try{
        const community = await db.Community.findByPk(CommunityId);
        const checkDuplicate = await db.Community_Member.findOne({where: {
            [Op.and]: [
                {UserId: UserId},
                {CommunityId: CommunityId}
            ]
        }})
        if(checkDuplicate){
            return res.status(200).json({
                success: false,
                messages: "You are already a member!"
            })
        }
        if(community.privacy == "Open"){
            await db.Community_Member.create({
                UserId,
                CommunityId
            });
            res.status(200).json({
                success: true,
                messages: "Join success!"
            })
        }
        if(community.privacy == "Closed"){
            await db.Request_Membership.create({
                UserId,
                CommunityId
            });
            res.status(200).json({
                success: true,
                messages: "Your request to join this community has been sent"
            })
        }
        
    }catch(error){
        console.log(error);
        return res.status(200).json({
            success:false,
            errors: error
        })
    }
}

module.exports.updateRole = async function(req, res){
    try{
        if(req.body.role == 'Owner'){
            return res.status(200).json({
                success: false,
                messages: "You can't change ownership"
            })
        }
        const findMembership = await db.Community_Member.findOne({where:{
            [Op.and]: [
                {UserId: req.params.UserId},
                {CommunityId: req.params.id},
            ]
        }})
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const findRole = await db.Community_Member.findOne({where: {
            UserId: decoded.UserId
        }})
        if(findRole.role == 'Administrator' && findMembership.role == 'Owner'){
            return res.status(200).json({
                success: false,
                messages: "You don't have authorization to change this member"
            })
        }
        if(req.body.role == "Administrator"){
            findMembership.update({
                role: "Administrator"
            })
    
            return res.status(200).json({
                success: true,
                messages: "Role updated"
            })
        }
        if(req.body.role == "Member"){
            findMembership.update({
                role: "Member"
            })
    
            return res.status(200).json({
                success: true,
                messages: "Role updated"
            })
        }
        return res.status(200).json({
            success: false,
            messages: "Role update failed"
        })
        
    }catch(error){
        console.log(error);
        return res.status(200).json({
            success:false,
            errors: error
        })
    }
}

module.exports.changeOwner = async function (req, res){
    try{
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const findMembership = await db.Community_Member.findOne({where:{
            [Op.and]: [
                {UserId: decoded.UserId},
                {CommunityId: req.params.id},
                {role: 'Owner'}
            ]
        }})
        const substitute = req.body.substitute
        const substituteFind = await db.Community_Member.findOne({where: {
            [Op.and]: [
                {UserId: substitute},
                {CommunityId: req.params.id},
            ]
        }})
        if(!substituteFind){
            return res.status(200).json({
                success:false,
                message: "Harus memilih pengganti sebagai owner!"
            })
        }
        await substituteFind.update({
            role: "Owner"
        });
        findMembership.update({
            role: 'Member'
        })
        res.status(200).json({
            success: true,
            messages: "Role updated"
        })
    }catch(error){
        console.log(error);
        return res.status(200).json({
            success:false,
            errors: error
        })
    }
}

module.exports.leaveCommunity = async function(req,res){
    try{
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const checkOwner = await db.Community_Member.findOne({where: {
            [Op.and]: [
                {UserId: decoded.UserId},
                {CommunityId: req.params.id},
            ]
        }})
        if(checkOwner.role == 'Owner'){
            return res.status(200).json({
                success: false,
                messages: "You must your ownership to other people first!"
            })
        }
        await db.Community_Member.destroy({where: {
            [Op.and]: [
                {UserId: decoded.UserId},
                {CommunityId: req.params.id},
            ]
        }});
        return res.status(200).json({
            success: true,
            messages: "You leave the group"
        })
    }catch(error){
        console.log(error);
        return res.status(200).json({
            success:false,
            errors: error
        })
    }
}