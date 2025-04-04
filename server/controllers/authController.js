// server/controllers/authController.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { getGithubAccessToken, getGithubUserData } = require('../utils/githubOAuth');

const handleGithubCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const accessToken = await getGithubAccessToken(code);
    const githubUser = await getGithubUserData(accessToken);

    let user = await User.findOne({ where: { githubId: githubUser.id } });

    if (!user) {
      user = await User.create({
        username: githubUser.login,
        email: githubUser.email,
        avatar: githubUser.avatar_url,
        githubId: githubUser.id,
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  } catch (error) {
    console.error('GitHub OAuth Error:', error);
    res.redirect('http://localhost:5173/login?error=github_auth_failed');
  }
};

module.exports = {
  handleGithubCallback,
};