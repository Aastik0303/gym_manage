const express = require('express');
const router = express.Router();
const {
  getAssignedMembers,
  updateWorkoutPlan,
  updateDietPlan
} = require('../controllers/trainerController');
const { protect, authorize } = require('../middleware/auth');

// Make sure only trainers can access these endpoints
router.use(protect);
router.use(authorize('trainer'));

router.get('/members', getAssignedMembers);
router.put('/members/:id/workout', updateWorkoutPlan);
router.put('/members/:id/diet', updateDietPlan);

module.exports = router;
