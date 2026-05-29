
const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // duration in months
  features: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Plan', PlanSchema);
