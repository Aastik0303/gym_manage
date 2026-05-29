const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  day: { type: String, required: true }, // e.g. "Monday", "Tuesday"
  time: { type: String, required: true }, // e.g. "08:00 AM - 09:30 AM"
  capacity: { type: Number, required: true },
  enrolledMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Class', ClassSchema);
