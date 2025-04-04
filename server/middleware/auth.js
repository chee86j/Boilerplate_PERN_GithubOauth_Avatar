import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check token expiration
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return res.status(401).json({ error: 'Token has expired' });
      }

      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token has expired' });
      }
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      }
      throw jwtError;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default auth;