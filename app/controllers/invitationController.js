const db = require('../models/index.js');
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
require("dotenv").config({ path: "../.env" });


module.exports.getInvitationUser = async function (req, res) {
    try {
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const invitation = await db.Invitation.findAll({
            where: {
                UserId: decoded.UserId
            }
        })
        return res.status(200).json({
            data: invitation
        })
    } catch (error) {
        return res.status(200).json({
            success: false,
            errors: error
        })
    }
}

module.exports.getInvitationCommunity = async function (req, res) {
    try {
        const invitation = await db.Invitation.findAll({
            where: {
                CommunityId: req.params.CommunityId
            }
        })
        return res.status(200).json({
            data: invitation
        })
    } catch (error) {
        return res.status(200).json({
            success: false,
            errors: error
        })
    }
}

module.exports.createInvitation = async function (req, res) {
    const { CommunityId, UserId } = req.body;
    try {
        const checkDuplicate = await db.Community_Member.findOne({
            where: {
                [Op.and]: [
                    { UserId: UserId },
                    { CommunityId: CommunityId }
                ]
            }
        })
        if (checkDuplicate) {
            return res.status(200).json({
                success: false,
                messages: "This User is already a member!"
            })
        }
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const Inviter = decoded.UserId;
        const invite = await db.Invitation.create({
            Inviter,
            UserId,
            CommunityId
        })
        return res.status(200).json({
            messages: "User invited",
            data: invite
        })
    } catch (error) {
        return res.status(200).json({
            success: false,
            errors: error
        })
    }
}

module.exports.respondInvite = async function (req, res) {
    const { respond } = req.body;
    try {
        if (!respond) {
            return res.status(200).json({
                success: false,
                messages: "Please input the respond"
            })
        }
        const invite = await db.Invitation.findByPk(req.params.id);
        if (respond == "Accept") {
            const { UserId, CommunityId } = invite
            const role = "Member"
            await db.Community_Member.create({
                UserId,
                CommunityId,
                role
            });
            await db.Invitation.destroy({ where: { id: req.params.id } });
            return res.status(200).json({
                messages: "Community Joined"
            })
        }
        if (respond == "Refuse") {
            invite.update({
                status: "Refused"
            })
            return res.status(200).json({
                messages: "Invitation refused"
            })
        }
    } catch (error) {
        return res.status(200).json({
            success: false,
            errors: error
        })
    }
}

module.exports.deleteInvite = async function (req, res) {
    const { id } = req.params
    try {
        await db.Invitation.destroy({ where: { id: id } })
        return res.status(200).json({
            success: true,
            messages: "Delete success!"
        })
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            success: false,
            errors: error
        })
    }
}