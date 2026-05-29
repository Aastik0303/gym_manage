const User = require('../models/User');

// @desc    Get members assigned to this trainer
// @route   GET /api/trainer/members
// @access  Private (Trainer only)
const getAssignedMembers = async (req, res) => {
  try {
    const members = await User.find({ assignedTrainer: req.user._id, role: 'member' })
      .populate('membershipPlan', 'name price');
    res.json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign or Update Workout Plan for a Member
// @route   PUT /api/trainer/members/:id/workout
// @access  Private (Trainer only)
const updateWorkoutPlan = async (req, res) => {
  try {
    const { workoutPlan } = req.body; // Array of days with exercises
    const memberId = req.params.id;

    // Verify member exists and is assigned to this trainer
    const member = await User.findOne({ _id: memberId, role: 'member' });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    if (member.assignedTrainer && member.assignedTrainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this member\'s plan' });
    }

    member.workoutPlan = workoutPlan;
    await member.save();

    res.json({ success: true, message: 'Workout plan updated successfully', data: member.workoutPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign or Update Diet Plan for a Member
// @route   PUT /api/trainer/members/:id/diet
// @access  Private (Trainer only)
const updateDietPlan = async (req, res) => {
  try {
    const { dietPlan } = req.body; // Array of days with meals
    const memberId = req.params.id;

    // Verify member exists and is assigned to this trainer
    const member = await User.findOne({ _id: memberId, role: 'member' });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    if (member.assignedTrainer && member.assignedTrainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this member\'s plan' });
    }

    member.dietPlan = dietPlan;
    await member.save();

    res.json({ success: true, message: 'Diet plan updated successfully', data: member.dietPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAssignedMembers,
  updateWorkoutPlan,
  updateDietPlan
};
