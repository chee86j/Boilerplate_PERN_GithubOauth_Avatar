// server/controllers/authController.js
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { getGithubAccessToken, getGithubUserData } from '../utils/githubOAuth.js';

export const handleGithubCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const accessToken = await getGithubAccessToken(code);
    const githubUser = await getGithubUserData(accessToken);

    // Convert GitHub ID to a number
    const githubId = parseInt(githubUser.id, 10);

    let user = await User.findOne({ where: { githubId } });

    if (!user) {
      user = await User.create({
        username: githubUser.login,
        email: githubUser.email || `${githubUser.login}@github.com`, // Fallback email if GitHub email is private
        avatar: githubUser.avatar_url,
        githubId,
      });
    } else {
      // Update user information in case it changed on GitHub
      await user.update({
        username: githubUser.login,
        avatar: githubUser.avatar_url,
        email: githubUser.email || user.email, // Keep existing email if GitHub email is private
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  } catch (error) {
    console.error('GitHub OAuth Error:', error);
    console.error('Error details:', error.message);
    res.redirect('http://localhost:5173/login?error=github_auth_failed');
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.githubId) {
      return res.status(401).json({ message: 'Please login with GitHub' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        username: user.username, 
        avatar: user.avatar 
      } 
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ 
      where: { 
        email 
      } 
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.status(201).json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        username: user.username,
        avatar: user.avatar
      } 
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};