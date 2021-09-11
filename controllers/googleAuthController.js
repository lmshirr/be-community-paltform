require('dotenv').config({ path: './.env' });
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { getGoogleAuthURL, getTokens } = require('../helpers/googleAuth');
const { google } = require('googleapis');

const tokenAge = 60 * 60;

module.exports.getGoogleAuthURL = async (req, res) => {
    const url = await getGoogleAuthURL();
    return res.status(200).json({
        success: true,
        url
    });
}

module.exports.googleLogin = async (req, res) => {
    const code = req.query.code;

    const { id_token, access_token } = await getTokens(
        code,
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:5000/api/user/auth/google'
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



