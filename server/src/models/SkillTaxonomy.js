const mongoose = require('mongoose');
const { AYUSH_DISCIPLINES } = require('../constants/ayush');

const skillTaxonomySchema = new mongoose.Schema(
  {
    discipline: { type: String, enum: AYUSH_DISCIPLINES, required: true, index: true },
    skillNode: { type: String, required: true, trim: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillTaxonomy', default: null },
  },
  { timestamps: true }
);

skillTaxonomySchema.virtual('children', {
  ref: 'SkillTaxonomy',
  localField: '_id',
  foreignField: 'parent',
});

skillTaxonomySchema.set('toJSON', { virtuals: true });
skillTaxonomySchema.index({ discipline: 1, skillNode: 1 }, { unique: true });

module.exports = mongoose.model('SkillTaxonomy', skillTaxonomySchema);