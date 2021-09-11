require('dotenv').config({ path: './.env' });
const db = require('../models/index.js');
const uuid = require('uuid');
const nodemailer = require("nodemailer");
const { use } = require('../routes/index.js');
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const smtpTransportModule = require('nodemailer-smtp-transport');
const axios = require('axios');
const { getGoogleAuthURL, getTokens } = require('./googleapis.js');
const { google } = require('googleapis');

const tokenAge = 60 * 60;

module.exports.getGoogleAuthURL = async (req, res) => {
    const url = await getGoogleAuthURL();
    return res.status(200).json({
        success: true,
        content: url
    });
}

module.exports.authenticateGoogle = async (req, res) => {
    const code = req.query.code;

    const { id_token, access_token } = await getTokens(
        code,
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:5000/auth/google'
    );

    const googleUser = await axios.get(
        `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${access_token}`,
        { headers: { Authorization: `Bearer ${id_token}` } })
        .then(response => response.data)
        .catch(err => {
            console.log(err);
            throw new Error(err.message);
        });

    const token = await jwt.sign(googleUser, process.env.SECRET_KEY, { expiresIn: tokenAge });
    res.cookie("jwt", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).json({
        success: true,
        message: "Login Success"
    });
}



