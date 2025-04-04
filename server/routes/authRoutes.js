import express from 'express';
import { handleGithubCallback, login, register } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/github/callback', handleGithubCallback);
router.post('/login', login);
router.post('/register', register);
router.get('/me', auth, (req, res) => {
  res.json(req.user);
});

export default router;