const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getAllUsers,
  updateUser,
  deleteUser,
  createClass,
  deleteClass,
  createPlan,
  deletePlan,
  createNotice,
  deleteNotice
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Make sure only admins can access these endpoints
router.use(protect);
router.use(authorize('admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.post('/classes', createClass);
router.delete('/classes/:id', deleteClass);

router.post('/plans', createPlan);
router.delete('/plans/:id', deletePlan);

router.post('/notices', createNotice);
router.delete('/notices/:id', deleteNotice);

module.exports = router;

