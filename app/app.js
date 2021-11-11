/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const apiRoutes = require('./routes/index');
const {
  NotFoundException,
  HttpException,
} = require('./shared/utils/httpExceptions');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const basicInfo = require('../docs/info');
const environmentConfig = require('./shared/utils/config/environtmentConfig');
// development only
const morgan = require('morgan');

environmentConfig('test');

// app
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://139.162.6.97',
      'https://community-platform.nikici.com',
      'https://community.sagaratechnology.com',
    ],
    credentials: true,
    withCredentials: true,
  })
);

// logging http req and res for development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// express static file
app.use('/assets', express.static('assets'));

// swagger documentation
const swaggerSpec = swaggerJsdoc(basicInfo);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// route
app.use('/api', apiRoutes);

// not found routes
app.all('*', (_, __, next) => {
  next(new NotFoundException('Route not found'));
});

// catch global error
app.use(
  /**
   *
   * @param {{message: string, description: object, statusCode: number, isOperational: boolean}} err
   * @param {import("express").Request} _req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  function (err, _req, res, _next) {
    if (err instanceof HttpException) {
      return res.status(err.statusCode).json({
        statusCode: err.statusCode,
        message: err.message,
        errors: err.description,
      });
    }

    console.log(err);

    return res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      errors: err,
    });
  }
);

process.on('unhandledRejection', (reason) => {
  // I just caught an unhandled promise rejection,
  // since we already have fallback handler for unhandled errors (see below),
  // let throw and let him handle that
  throw reason;
});

process.on('uncaughtException', (error) => {
  // I just received an error that was never handled, time to handle it and then decide whether a restart is needed
  console.log(error);
  process.exit(1);
});

module.exports = app;
