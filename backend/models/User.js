const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: String, required: true }, // Can be "12" or "10-12" or "Till Failure"
  weight: { type: String, default: 'Bodyweight' }
});

const WorkoutDaySchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g. "Monday"
  exercises: [ExerciseSchema]
});

const MealSchema = new mongoose.Schema({
  time: { type: String, required: true }, // e.g. "08:00 AM"
  food: { type: String, required: true },
  calories: { type: Number, default: 0 }
});

const DietDaySchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g. "Monday"
  meals: [MealSchema]
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['member', 'trainer', 'admin'], default: 'member' },
  
  // Membership fields (for Members)
  membershipPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  membershipStatus: { type: String, enum: ['active', 'pending', 'expired', 'none'], default: 'none' },
  assignedTrainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Custom workout & diet plans (assigned by Trainer, for Members)
  workoutPlan: [WorkoutDaySchema],
  dietPlan: [DietDaySchema],

  // Specialty (for Trainers)
  trainerSpecialty: { type: String },

  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
