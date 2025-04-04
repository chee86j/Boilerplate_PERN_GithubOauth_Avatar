const express = require('express');
const router = express.Router();
const { updateUser, deleteUser, getUserProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

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

module.exports = router;