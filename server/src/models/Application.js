const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coverNote: { type: String, trim: true, maxlength: 800 },
    status: { type: String, enum: ['submitted', 'under_review', 'shortlisted', 'rejected', 'accepted'], default: 'submitted' },
  },
  { timestamps: true }
);

applicationSchema.index({ opportunityId: 1, studentId: 1 }, { unique: true });
module.exports = mongoose.model('Application', applicationSchema);
