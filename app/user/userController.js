const {
  User,
  Activation,
  Invitation,
  Request_Membership,
} = require('../shared/db/models');
const uuid = require('uuid');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  InternalServerException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} = require('../shared/utils/httpExceptions/index');
const mailService = require('../shared/utils/email/mail.service');
const userService = require('./userService');
const { getGoogleAuthURL, getTokens } = require('../shared/utils/googleAuth/googleAuth');
const axios = require('axios');

const tokenAge = 60 * 60;

module.exports.register = async function (req, res, next) {
  const { email, password, name, phone_number, birthday } = req.body;

  try {
    const user = await User.create({
      email,
      password,
      name,
      phone_number,
      birthday,
    });

    const token = uuid.v4();
    const host = req.get('host');
    const link = `http://${host}/api/user/verify?token=${token}`;

    // send email
    mailService.sendEmail(email, link);

    await Activation.create({
      user_id: user.id,
      activation_token: token,
    });

    return res.status(201).json({
      messages: 'Register Success!',
      data: user,
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return next(
        new BadRequestException(
          'Validation error',
          error.errors.map((e) => ({ attribute: e.path, message: e.message }))
        )
      );
    }
    console.log(error);
    return next(new InternalServerException(error));
  }
};

module.exports.verification = async function (req, res, next) {
  const activation_token = req.query.token;

  let user;
  try {
    const { user_id } = await Activation.findOne({
      where: { activation_token },
    });

    if (!user_id) {
      return next(new NotFoundException('Token not found'));
    }

    user = await User.findOne({ where: { id: user_id } });

    await user.update({ confirmed: true });

    await Activation.destroy({
      where: { user_id },
    });
  } catch (error) {
    console.log(error);
    return next(new InternalServerException());
  }

  return res.json({
    messages: 'Email verification success',
    data: user,
  });
};

module.exports.login = async function (req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(new NotFoundException('User not found'));
    }

    // check user confirmed
    if (!user.confirmed) {
      return next(
        new UnauthorizedException('Please activate your email first')
      );
    }

    const isPasswordMatch = bcrypt.compareSync(password, user.password);

    if (!isPasswordMatch) {
      return next(new UnauthorizedException('Invalid credential'));
    }

    const { pk, id, name, profile_pict, phone_number, confirmed } = user;

    const token = await jwt.sign(
      { pk, id, name, profile_pict, phone_number, confirmed },
      process.env.SECRET_KEY,
      {
        expiresIn: tokenAge,
      }
    );

    res.cookie('jwt', token, { maxAge: 60 * 60 * 1000 });

    res.json({
      message: 'Login Success',
      data: {
        pk,
        id,
        name,
        profile_pict,
        phone_number,
      },
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }
};

module.exports.findUser = async function (req, res, next) {
  try {
    const findUser = await User.findAll({
      where: {
        name: {
          [Op.iLike]: `%${req.params.key}%`,
        },
      },
      attributes: ['id', 'name', 'profile_pict'],
    });

    return res.json({
      success: true,
      data: findUser,
    });
  } catch (error) {
    console.log(error);
    return next(new InternalServerException('Internal server error', error));
  }
};

module.exports.getUserDetail = async function (req, res, next) {
  const { id } = req.params;

  let user;
  try {
    user = await userService.getUserDetail(id);
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({ data: user });
};

module.exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });

  return res.status(200).json({
    message: 'Logout Success',
  });
};

module.exports.getInvitationUser = async function (req, res, next) {
  const { id: user_id } = req.user;

  let invitation;
  try {
    invitation = await Invitation.findAll({
      where: {
        user_id,
      },
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({
    data: invitation,
  });
};

module.exports.getRequestUser = async function (req, res, next) {
  const { id: user_id } = req.user;

  let request;
  try {
    request = await Request_Membership.findAll({
      where: {
        user_id,
      },
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({
    data: request,
  });
};

module.exports.deleteUserRequest = async function (req, res, next) {
  const { id: request_id } = req.params;
  const { id: user_id } = req.user;

  let request;
  try {
    request = await Request_Membership.findOne({ where: { id: request_id } });

    if (request.user_id !== user_id) {
      return next(
        new ForbiddenException('You have not allowed to do this action')
      );
    }

    request = await request.destroy();
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({
    messages: 'Delete success!',
    data: request,
  });
};

module.exports.getAllUserCommunityJoinOrNot = async (req, res, next) => {
  const { id } = req.user;
  const { status } = req.query;

  let communities;
  try {
    communities = await userService.getCommunityUserJoinOrNot(id, status);
  } catch (error) {
    return next(error);
  }

  return res.json({ data: communities });
};

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
    `${process.env.SERVER_URL}/api/users/auth/google`
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

    const token = await jwt.sign(userPayload, process.env.SECRET_KEY, {
      expiresIn: tokenAge,
    });
    res.cookie('jwt', token, { maxAge: process.env.TOKEN_AGE });
    res.redirect(`${process.env.CLIENT_ROOT_URL}`);
  } catch (error) {
    return next(new InternalServerException(error));
  }
};

module.exports.getCurrentUser = (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    res.status(200).json({
      success: true,
      content: {
        loggedIn: true,
        user,
      },
    });
  } else {
    res.status(401).json({
      success: false,
      content: {
        loggedIn: false,
      },
    });
  }
};
