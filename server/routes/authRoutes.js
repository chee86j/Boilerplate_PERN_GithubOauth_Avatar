const express = require('express');
const router = express.Router();
const { handleGithubCallback, login, register } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.get('/github/callback', handleGithubCallback);
router.post('/login', login);
router.post('/register', register);
router.get('/me', auth, (req, res) => {
  res.json(req.user);
});

module.exports = router;