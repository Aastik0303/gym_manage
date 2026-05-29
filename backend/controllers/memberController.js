const User = require('../models/User');
const Class = require('../models/Class');
const Plan = require('../models/Plan');

// @desc    Select a trainer
// @route   PUT /api/member/select-trainer
// @access  Private (Member only)
const selectTrainer = async (req, res) => {
  try {
    const { trainerId } = req.body;

    const trainer = await User.findOne({ _id: trainerId, role: 'trainer' });
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    const member = await User.findById(req.user._id);
    member.assignedTrainer = trainerId;
    await member.save();

    res.json({ success: true, message: 'Trainer selected successfully', data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all active classes and schedules
// @route   GET /api/member/classes
// @access  Private
const getClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('trainer', 'name email trainerSpecialty')
      .populate('enrolledMembers', 'name email');
    res.json({ success: true, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Book / Join a class
// @route   POST /api/member/classes/:id/join
// @access  Private (Member only)
const joinClass = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);

    if (!classItem) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    // Check if member already registered
    if (classItem.enrolledMembers.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this class' });
    }

    // Check capacity
    if (classItem.enrolledMembers.length >= classItem.capacity) {
      return res.status(400).json({ success: false, message: 'Class is already at full capacity' });
    }

    // Enroll member
    classItem.enrolledMembers.push(req.user._id);
    await classItem.save();

    res.json({ success: true, message: 'Successfully booked class slot', data: classItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel class booking / Leave class
// @route   POST /api/member/classes/:id/leave
// @access  Private (Member only)
const leaveClass = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);

    if (!classItem) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    // Check if member is actually enrolled
    if (!classItem.enrolledMembers.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Not enrolled in this class' });
    }

    // Remove member
    classItem.enrolledMembers = classItem.enrolledMembers.filter(
      (memberId) => memberId.toString() !== req.user._id.toString()
    );
    await classItem.save();

    res.json({ success: true, message: 'Successfully cancelled class slot', data: classItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Subscribe / purchase membership plan
// @route   POST /api/member/subscribe
// @access  Private (Member only)
const subscribeToPlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Membership plan not found' });
    }

    const member = await User.findById(req.user._id);
    member.membershipPlan = planId;
    member.membershipStatus = 'active'; // Simulating successful immediate payment gateways
    await member.save();

    res.json({ success: true, message: `Successfully purchased ${plan.name} Membership`, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all membership plans
// @route   GET /api/member/plans
// @access  Public
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  selectTrainer,
  getClasses,
  joinClass,
  leaveClass,
  subscribeToPlan,
  getPlans
};
