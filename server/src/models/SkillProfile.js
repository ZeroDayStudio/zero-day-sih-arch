const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillTaxonomy', required: true },
    proficiency: { type: Number, min: 0, max: 100, required: true },
  },
  { _id: false }
);

const skillProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    skills: { type: [skillSchema], default: [] },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    evidenceReferences: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('SkillProfile', skillProfileSchema);