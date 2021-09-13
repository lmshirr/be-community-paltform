const db = require('../models/index.js');
require('dotenv').config({path: './.env'});
const uuid = require('uuid');
const nodemailer = require("nodemailer");
const { use } = require('../routes/index.js');
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const smtpTransportModule = require('nodemailer-smtp-transport');

const tokenAge = 60 * 60;


module.exports.register = async function(req, res){
    const {email, password, name, phone_number, birthday} = req.body;
    try{
        const user = await db.User.create({email, password, name, phone_number, birthday});
        const smtpTransport = nodemailer.createTransport(smtpTransportModule({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        }));
        const token = uuid.v4();
        const host = req.get('host');
        const link ="http://"+host+"/api/user/verify?token="+token;
        mailOptions={
            to : email,
            subject : "Please confirm your Email account",
            html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
        }
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
                return res.status(200).json("error");
            }else{
                console.log("Message sent");
            }
        });
        await db.Activation.create({
            id_user: user.id,
            activation_token: token
        })
        res.status(201).json({
            success: true,
            messages: "Register Success!"
        });

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
    };
};

module.exports.verification = async function(req,res){
    const activation_token = req.query.token;
    console.log(activation_token)
    try{
        const findActivation = await db.Activation.findOne({ where : { activation_token }})
        console.log(findActivation.id_user);
        if(findActivation){
            const user = await db.User.findByPk(findActivation.id_user)
            await user.update({activation: "Active"})
            await db.Activation.destroy({where: {id_user: findActivation.id_user}})
            res.status(201).json({
                success: true,
                messages: "Email verification success"
            });
        }else{
            console.log(error);
            return res.status(200).json({
                success:false,
                errors: error
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

module.exports.login = async function(req, res){
    try{
        const user = await db.User.findOne({ where: { email: req.body.email,  } });
        if(user){
            if(user.activation !== "Active"){
                return res.status(200).json({
                    errors: {
                        attribute: "Authentication",
                        message: "Please activate your email first"
                    }
                })
            }
            const passwordAuth = bcrypt.compareSync(req.body.password, user.password);
            if(passwordAuth){
                const token = await jwt.sign({ UserId: user.id }, process.env.SECRET_KEY, { expiresIn: tokenAge} );
                res.cookie("jwt", token, {maxAge: 60 * 60 * 1000});
                res.status(201).json({
                    success: true,
                    message: "Login Success"
                })
            }else{
                res.status(200).json({
                    success: false,
                    message: "Email and password didn't match"
                })
            }
        }else{
            res.status(200).json({
                errors:{
                    attribute: "Authentication",
                    message: "Email is not registered"
                }
            })
        }
    }catch(error){
        return res.status(200).json({
            success:false,
            errors: error
        })
    }
}

module.exports.findUser = async function(req, res){
    try{
        const findUser = await db.User.findAll({where:{
            name:{
                [Op.iLike]: `%${req.params.key}%`
            }},
            attributes:[
                "id",
                "name",
                "profile_pict"
            ]
        })
        return res.status(200).json({
            success:true,
            findUser
        })
    }catch(error){
        return res.status(200).json({
            success:false,
            errors: error
        })
    }
}

module.exports.getUserDetail = async function(req, res){
    const { id } = req.params;
    try{
        const user = await db.User.findByPk(id, {
            attributes:[
                "id",
                "name",
                "profile_pict",
                "birthday",
                "email",
                "phone_number"
            ],

            include: [{
                model: db.Community,
                attributes:[
                    "id",
                    "name",
                    "community_pict"
                ]
            }]
        });
        return res.status(200).json({
            user
        })
    }catch(error){
        return res.status(200).json({
            success:false,
            errors: error
        })
    }
}

module.exports.editUser = async function(req, res){
    const { id } = req.params;
    const { name, phone_number, birthday, password } = req.body;
    const findUser = await db.User.findOne({where: {id: id}});
    if(password == null){
        return res.status(200).json({
            success: false,
            messages: "Please enter the password"
        })
    }
    if(!findUser){
        return res.status(200).json({
            success: false,
            messages: "User not found!"
        })
    }
    const comparePassword = bcrypt.compareSync(password, findUser.password);
    if(!comparePassword){
        return res.status(200).json({
            success: false,
            messages: "Wrong Password!"
        })
    }
    let profile_pict;
    if(req.file){
        profile_pict = req.file.filename;
    }
    try{
        findUser.update({
            name: name,
            phone_number: phone_number,
            birthday: birthday,
            profile_pict: profile_pict
        });
        return res.status(200).json({
            success: true,
            messages: "Profile updated!"
        })
    }catch(error){
        console.log(error);
        return res.status(200).json({
            success:false,
            errors: error
        })
    }
}

module.exports.logout = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(201).json({
        success: true,
        message: "Logout Success"
    })
};