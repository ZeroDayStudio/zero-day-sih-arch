const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['internship', 'placement', 'fellowship', 'apprenticeship'], required: true },
    requiredSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SkillTaxonomy' }],
    disciplines: [{ type: String, trim: true }],
    location: { type: String, trim: true },
    remote: { type: Boolean, default: false },
    stipend: { type: Number, min: 0 },
    eligibility: { type: String, trim: true },
    availability: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Opportunity', opportunitySchema);
