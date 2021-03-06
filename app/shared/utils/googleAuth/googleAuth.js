const { google } = require('googleapis');
const { default: axios } = require('axios');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.SERVER_URL}/api/users/auth/google`
);

const getGoogleAuthURL = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  });
};

const getTokens = async (code, clientId, clientSecret, redirectURI) => {
  const url = 'https://oauth2.googleapis.com/token';
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectURI,
    grant_type: 'authorization_code',
  };
  const query = new URLSearchParams(values);

  return axios
    .post(url, query.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      throw new Error(err.message);
    });
};

module.exports = { getGoogleAuthURL, getTokens };
