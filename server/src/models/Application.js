const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverNote: { type: String, trim: true, maxlength: 800 },
    status: {
      type: String,
      enum: [
        "submitted",
        "under_review",
        "shortlisted",
        "rejected",
        "accepted",
        "completed",
      ],
      default: "submitted",
    },
    outcome: {
      completedAt: { type: Date },
      employerRating: { type: Number, min: 1, max: 5 },
      employerFeedback: { type: String, trim: true, maxlength: 2000 },
      studentFeedback: { type: String, trim: true, maxlength: 2000 },
      curriculumFeedback: { type: String, trim: true, maxlength: 2000 },
    },
  },
  { timestamps: true },
);

applicationSchema.index({ opportunityId: 1, studentId: 1 }, { unique: true });
module.exports = mongoose.model("Application", applicationSchema);
