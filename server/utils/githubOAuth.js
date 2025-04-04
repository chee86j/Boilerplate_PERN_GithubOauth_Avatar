import axios from 'axios';

export const getGithubAccessToken = async (code) => {
  const response = await axios.post('https://github.com/login/oauth/access_token', {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
  }, {
    headers: {
      Accept: 'application/json',
    },
  });

  return response.data.access_token;
};

export const getGithubUserData = async (accessToken) => {
  const response = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};