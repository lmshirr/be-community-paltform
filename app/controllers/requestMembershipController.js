const db = require('../models/index.js');
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
require("dotenv").config({ path: "../.env" });

module.exports.getRequestUser = async function(req, res){
    try{
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const request = await db.Request_Membership.findAll({where: {
            UserId: decoded.UserId
        }})
        return res.status(200).json({
            data: request
        })
    }catch(error){
        return res.status(200).json({
            success:false,
            errors: error
        })
    }
}

module.exports.getRequestCommunity = async function(req, res){
    try{
        const request = await db.Request_Membership.findAll({where: {
            CommunityId: req.params.CommunityId
        }})
        return res.status(200).json({
            data: request
        })
    }catch(error){
        return res.status(200).json({
            success:false,
            errors: error
        })
    }
}

module.exports.respondRequest = async function(req, res){
    const {respond} = req.body;
    try{
        if(!respond){
            return res.status(200).json({
                success: false,
                messages: "Please input the respond"
            })
        }
        const request = await db.Request_Membership.findByPk(req.params.id);
        if(respond == "Approve"){
            const {UserId, CommunityId} = request
            const role = "Member"
            await db.Community_Member.create({
                UserId,
                CommunityId,
                role
            });
            await db.Request_Membership.destroy({where: {id: req.params.id}});
            return res.status(200).json({
                messages: "Request approved"
            })
        }
        if(respond == "Refuse"){
            request.update({
                status: "Refused"
            })
            return res.status(200).json({
                messages: "Request refused"
            })
        }
    }catch(error){
        return res.status(200).json({
            success:false,
            errors: error
        })
    }
}

module.exports.deleteRequest = async function(req, res){
    const {id} = req.params
    try{
        await db.Request_Membership.destroy({where: {id: id}})
        return res.status(200).json({
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