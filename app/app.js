const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const apiRoutes = require('./routes/index');
const { NotFoundException } = require('./utils/httpExceptions');

require('dotenv').config({ path: './.env' });

const app = express();
const port = 5000;

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

app.use('/api', apiRoutes);

// not found routes
app.all('*', (_, __, next) => {
  next(new NotFoundException('Route not found'));
});

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
app.listen(port, () => console.log(`This App is Running on port ${port}`));
