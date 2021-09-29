const {
  User,
  Activation,
  Invitation,
  Request_Membership,
  Community_Member,
} = require('../models/index');
require('dotenv').config({ path: './.env' });
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
} = require('../utils/httpExceptions/index');
const mailService = require('../utils/email/mail.service');

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
    user = await User.findOne({
      where: { id },
    });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({ data: user });
};

module.exports.editUser = async function (req, res, next) {
  const { id } = req.params;

  const { name, phone_number, birthday } = req.body;

  const user = await User.findOne({ where: { id } });

  if (!user) {
    return next(new NotFoundException('User not found'));
  }

  let profile_pict;

  if (req.file) {
    profile_pict = req.file.filename;
  }

  let userUpdated;
  try {
    userUpdated = await user.update(
      {
        name,
        phone_number,
        birthday,
        profile_pict,
        updated_at: new Date(),
      },
      { returning: true }
    );
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }
  return res.json({
    messages: 'Profile updated!',
    data: userUpdated,
  });
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

module.exports.getAllUserCommunity = async (req, res, next) => {
  const { id: user_id } = req.user;

  let communities;
  try {
    communities = await Community_Member.findAll({ where: { user_id } });
  } catch (error) {
    return next(new InternalServerException('Internal server error', error));
  }

  return res.json({ data: communities });
};
