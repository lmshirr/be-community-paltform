const jwt = require('jsonwebtoken');
const axios = require('axios');
const { getGoogleAuthURL, getTokens } = require('../helpers/googleAuth');
const { GoogleUser, User } = require('../models/index');
const {
  InternalServerException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} = require('../utils/httpExceptions/index');

const tokenAge = 60 * 60 * 1000;

module.exports.getGoogleAuthURL = async (req, res) => {
  const url = await getGoogleAuthURL();
  return res.status(200).json({
    success: true,
    url,
  });
};

module.exports.googleLogin = async (req, res, next) => {
  const { code } = req.query;

  const { id_token, access_token } = await getTokens(
    code,
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `http://localhost:${process.env.PORT}/api/users/auth/google`
  );

  try {
    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${access_token}`,
        { headers: { Authorization: `Bearer ${id_token}` } }
      )
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
        throw new Error(err.message);
      });

    let user = await User.findOne({
      where: { google_id: googleUser.id },
    });
    if (!user) {
      const newUser = await User.create({
        google_id: googleUser.id,
        email: googleUser.email,
        verified_email: googleUser.verified_email,
        name: googleUser.name,
        given_name: googleUser.given_name,
        family_name: googleUser.family_name,
        profile_pict: googleUser.picture,
        locale: googleUser.locale,
        hd: googleUser.hd,
      });

      user = await User.findOne({
        where: { google_id: newUser.google_id },
      });
    }

    const userPayload = {
      pk: user.pk,
      id: user.id,
      google_id: user.google_id,
      email: user.email,
      verified_email: user.verified_email,
      name: user.name,
      given_name: user.given_name,
      family_name: user.family_name,
      profile_pict: user.profile_pict,
      locale: user.locale,
      hd: user.hd,
    };

    const token = await jwt.sign(userPayload, process.env.SECRET_KEY, { expiresIn: tokenAge });
    res.cookie('jwt', token, { maxAge: 60 * 60 * 1000 });
    res.redirect(`${process.env.CLIENT_ROOT_URL}`);
    // res.status(201).json({
    //     success: true,
    //     message: "Login Success"
    // });
  } catch (error) {
    return next(new InternalServerException(error));
  }
}

module.exports.getCurrentUser = (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    res.status(200).json({
      success: true,
      content: {
        loggedIn: true,
        user,
      }
    });
  } else {
    res.status(401).json({
      success: false,
      content: {
        loggedIn: false,
      }
    });
  }
}
