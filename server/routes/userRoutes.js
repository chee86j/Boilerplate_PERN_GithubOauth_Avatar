import express from 'express';
import { updateUser, deleteUser, getUserProfile } from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { User } from '../models/index.js';

const router = express.Router();

// Get user profile
router.get('/profile', auth, getUserProfile);

// Update user profile
router.put('/profile', auth, upload.single('avatar'), updateUser);

// Delete user account
router.delete('/profile', auth, deleteUser);

// Update user avatar
router.put('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const avatarUrl = req.file.path;
    const user = await User.findByPk(req.user.id);
    await user.update({ avatar: avatarUrl });

    res.json({ avatar: avatarUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update avatar' });
  }
});

export default router;