const dotenv = require('dotenv');
const path = require('path');

/**
 *
 * @param {string} nodeEnv |test|production|development
 */
function environtmentConfig(status = null) {
  const nodeEnv = process.env.NODE_ENV;

  if (!status && !nodeEnv) {
    throw new Error('Must include NODE_ENV');
  }

  if (nodeEnv) {
    switch (nodeEnv) {
      case 'development':
        dotenv.config({
          path: path.join(__dirname, '../../../../.env'),
        });
        break;
      default:
        dotenv.config({
          path: path.resolve(__dirname, `../../../../.env.${nodeEnv}`),
        });
        break;
    }
  } else {
    switch (status) {
      case 'development':
        dotenv.config({
          path: path.join(__dirname, '../../../../.env'),
        });
        break;
      default:
        dotenv.config({
          path: path.resolve(__dirname, `../../../../.env.${status}`),
        });
        break;
    }
  }
}

module.exports = environtmentConfig;
