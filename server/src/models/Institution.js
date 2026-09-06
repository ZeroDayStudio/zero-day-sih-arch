const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    programs: [{ type: String, trim: true }],
    curriculumMap: [{ course: { type: String, trim: true }, skills: [{ type: String, trim: true }] }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Institution', institutionSchema);
