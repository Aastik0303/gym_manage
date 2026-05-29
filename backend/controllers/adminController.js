const User = require('../models/User');
const Class = require('../models/Class');
const Plan = require('../models/Plan');

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
const getAnalytics = async (req, res) => {
  try {
    const totalMembers = await User.countDocuments({ role: 'member' });
    const totalTrainers = await User.countDocuments({ role: 'trainer' });
    const totalClasses = await Class.countDocuments();
    
    // Count active plans
    const activeMemberships = await User.countDocuments({ role: 'member', membershipStatus: 'active' });
    
    // Retrieve all active members and aggregate potential revenue
    const activeUsers = await User.find({ role: 'member', membershipStatus: 'active' }).populate('membershipPlan');
    let totalRevenue = 0;
    activeUsers.forEach(user => {
      if (user.membershipPlan) {
        totalRevenue += user.membershipPlan.price;
      }
    });

    res.json({
      success: true,
      data: {
        totalMembers,
        totalTrainers,
        totalClasses,
        activeMemberships,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users in system
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate('membershipPlan', 'name price')
      .populate('assignedTrainer', 'name email trainerSpecialty')
      .select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user details / Role / Status
// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
const updateUser = async (req, res) => {
  try {
    const { role, membershipStatus, assignedTrainer, trainerSpecialty } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role) user.role = role;
    if (membershipStatus) user.membershipStatus = membershipStatus;
    if (trainerSpecialty) user.trainerSpecialty = trainerSpecialty;
    
    if (assignedTrainer !== undefined) {
      if (assignedTrainer === '') {
        user.assignedTrainer = undefined;
      } else {
        user.assignedTrainer = assignedTrainer;
      }
    }

    await user.save();
    
    res.json({ success: true, message: 'User updated successfully', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Don't let admin delete their own account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account' });
    }

    await User.findByIdAndDelete(req.params.id);
    
    // Also clean up assigned trainer status or enrollments in classes
    if (user.role === 'member') {
      await Class.updateMany(
        { enrolledMembers: user._id },
        { $pull: { enrolledMembers: user._id } }
      );
    } else if (user.role === 'trainer') {
      // Set assigned trainers to undefined for affected members
      await User.updateMany({ assignedTrainer: user._id }, { $unset: { assignedTrainer: 1 } });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new gym class
// @route   POST /api/admin/classes
// @access  Private (Admin only)
const createClass = async (req, res) => {
  try {
    const { name, trainer, day, time, capacity } = req.body;

    const classItem = await Class.create({
      name,
      trainer,
      day,
      time,
      capacity
    });

    res.status(201).json({ success: true, message: 'Class created successfully', data: classItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a gym class
// @route   DELETE /api/admin/classes/:id
// @access  Private (Admin only)
const deleteClass = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    await Class.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a membership plan
// @route   POST /api/admin/plans
// @access  Private (Admin only)
const createPlan = async (req, res) => {
  try {
    const { name, price, duration, features } = req.body;

    const plan = await Plan.create({
      name,
      price,
      duration,
      features
    });

    res.status(201).json({ success: true, message: 'Membership plan created successfully', data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a membership plan
// @route   DELETE /api/admin/plans/:id
// @access  Private (Admin only)
const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    await Plan.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const Notice = require('../models/Notice');

// @desc    Create a Notice announcement
// @route   POST /api/admin/notices
// @access  Private (Admin only)
const createNotice = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const notice = await Notice.create({
      title,
      content,
      category
    });

    res.status(201).json({ success: true, message: 'Notice published successfully', data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a Notice announcement
// @route   DELETE /api/admin/notices/:id
// @access  Private (Admin only)
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    await Notice.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notice purged successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};

