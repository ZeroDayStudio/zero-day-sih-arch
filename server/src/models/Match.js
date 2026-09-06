const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    opportunityId: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    breakdown: {
      skillFit: { type: Number, required: true, min: 0, max: 100 },
      domainFit: { type: Number, required: true, min: 0, max: 100 },
      eligibility: { type: Number, required: true, min: 0, max: 100 },
      locationFit: { type: Number, required: true, min: 0, max: 100 },
      availability: { type: Number, required: true, min: 0, max: 100 },
    },
  },
  { timestamps: true }
);

matchSchema.index({ studentId: 1, opportunityId: 1 }, { unique: true });

module.exports = mongoose.model('Match', matchSchema);