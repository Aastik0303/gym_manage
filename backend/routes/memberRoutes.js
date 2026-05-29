const express = require('express');
const router = express.Router();
const {
  selectTrainer,
  getClasses,
  joinClass,
  leaveClass,
  subscribeToPlan,
  getPlans
} = require('../controllers/memberController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/plans', getPlans);

// Member-only routes (protected)
router.put('/select-trainer', protect, authorize('member'), selectTrainer);
router.post('/subscribe', protect, authorize('member'), subscribeToPlan);
router.post('/classes/:id/join', protect, authorize('member'), joinClass);
router.post('/classes/:id/leave', protect, authorize('member'), leaveClass);

// General protected routes
router.get('/classes', protect, getClasses);

module.exports = router;
