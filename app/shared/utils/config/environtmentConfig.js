const dotenv = require('dotenv');
const path = require('path');

/**
 *
 * @param {string} nodeEnv |test|production|development
 */
function environtmentConfig(nodeEnv) {
  if (nodeEnv === 'development') {
    console.log('dev');
    dotenv.config({
      path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`),
    });
  } else {
    dotenv.config({
      path: path.resolve(__dirname, `../../../../.env.${nodeEnv}`),
    });
  }
}

module.exports = environtmentConfig;
