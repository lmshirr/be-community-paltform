const db = require('../models/index.js');
const { Op } = require("sequelize");
const communityRouter = require('../routes/API/communityRoutes.js');
require("dotenv").config({ path: "../.env" });


module.exports.findCommunity = async function (req, res) {
    try {
        const findCommunities = await db.Community.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${req.params.key}%`
                }
            },
            include: [{
                model: db.User,
                attributes: [
                    "id",
                    "name",
                    "profile_pict"
                ]
            }]
        })
        return res.status(200).json({
            success: true,
            data: findCommunities
        })
    } catch (error) {
        return res.status(200).json({
            success: false,
            errors: error
        })
    }
}

module.exports.getCommunityDetails = async function (req, res) {
    try {
        const community = await db.Community.findByPk(req.params.id, {
            include: [{
                model: db.User,
                attributes: [
                    "id",
                    "name",
                    "profile_pict"
                ]
            }]
        })
        const totalMember = await db.Community_Member.count({ where: { CommunityId: req.params.id } })
        return res.status(200).json({
            data: {
                id: community.id,
                name: community.name,
                privacy: community.privacy,
                member: community.Users,
                totalMember: totalMember
            }
        })
    } catch (error) {
        return res.status(200).json({
            success: false,
            errors: error
        })
    }
}

module.exports.createCommunity = async function (req, res) {
    let community_pict = "com_pict.jpg";
    if (req.file) {
        community_pict = req.file.filename;
    }
    const {
        UserId,
        name,
        type,
        description
    } = req.body;

    try {
        let privacy;
        if (req.body.privacy == "Open") {
            privacy = "Open"
        }
        if (req.body.privacy == "Closed") {
            privacy = "Closed"
        }
        const community = await db.Community.create({
            name,
            type,
            description,
            community_pict,
            privacy
        });
        const CommunityId = community.id;
        const role = "Owner";
        await db.Community_Member.create({
            CommunityId,
            UserId,
            role
        })
        res.status(201).json({
            messages: "Community created",
            data: community
        })
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(200).json({
                success: false,
                errors: error.errors.map((e) => {
                    return {
                        attribute: e.path,
                        message: e.message
                    };
                })
            })
        } else {
            console.log(error);
            return res.status(200).json({
                success: false,
                errors: error
            })
        };
    }
}

module.exports.editCommunity = async function (req, res) {
    const { id } = req.params;
    let community_pict;
    if (req.file) {
        community_pict = req.file.filename;
    }
    const { name, type, description } = req.body;

    try {
        let privacy;
        if (req.body.privacy == "Open") {
            privacy = "Open"
        }
        if (req.body.privacy == "Closed") {
            privacy = "Closed"
        }
        const community = await db.Community.findByPk(id);
        community.update({
            name: name,
            type: type,
            description: description,
            community_pict: community_pict,
            privacy: privacy
        });
        return res.status(200).json({
            message: "Update Community Success",
            data: community
        })
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            success: false,
            errors: error
        })
    }
}

module.exports.deleteCommunity = async function (req, res) {
    try {
        await db.Community.destroy({ where: { id: req.params.id } })
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