/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const apiRoutes = require('./routes/index');
const { NotFoundException } = require('./utils/httpExceptions');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const basicInfo = require('../docs/info');

require('dotenv').config({ path: './.env' });

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    withCredentials: true,
  })
);
// express static file
app.use('/assets', express.static('../assets'));

// swagger documentation
const swaggerSpec = swaggerJsdoc(basicInfo);
console.log(swaggerSpec);
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
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  function (err, req, res, next) {
    if (err.description) {
      return res.status(err.statusCode || 500).json({
        statusCode: err.statusCode,
        message: err.message,
        errors: err.description,
      });
    }
    return res
      .status(err.statusCode || 500)
      .json({ statusCode: err.statusCode, message: err.message });
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
  process.exit(1);
});

module.exports = app;
