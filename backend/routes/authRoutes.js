const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getTrainers, getNotices } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/trainers', getTrainers);
router.get('/notices', getNotices);

module.exports = router;

