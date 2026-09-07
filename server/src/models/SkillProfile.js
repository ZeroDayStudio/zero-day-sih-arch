const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkillTaxonomy",
      required: true,
    },
    proficiency: { type: Number, min: 0, max: 100, required: true },
  },
  { _id: false },
);

const evidenceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["certificate", "project", "assessment", "mentor_evaluation"],
      default: "certificate",
    },
    issuer: { type: String, trim: true },
    fileUrl: { type: String, trim: true },
    linkedSkillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkillTaxonomy",
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewNote: { type: String, trim: true },
    verificationSource: {
      type: String,
      enum: ["institution", "mentor", "employer", "admin"],
    },
    assessmentScore: { type: Number, min: 0, max: 100 },
    projectUrl: { type: String, trim: true },
    evaluatedAt: { type: Date },
  },
  { timestamps: true },
);

const skillProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    contact: { type: String, trim: true },
    education: { type: String, trim: true },
    disciplines: [{ type: String, trim: true }],
    location: { type: String, trim: true },
    availability: { type: Number, min: 0, max: 100, default: 100 },
    publicSlug: { type: String, unique: true, sparse: true, index: true },
    skills: { type: [skillSchema], default: [] },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    evidence: { type: [evidenceSchema], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SkillProfile", skillProfileSchema);
