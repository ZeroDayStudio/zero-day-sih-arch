const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true },
    contact: { type: String, trim: true },
    education: { type: String, trim: true },
    skills: [{ name: { type: String, trim: true }, proficiency: { type: Number, min: 0, max: 100 } }],
    certificates: [{ name: { type: String, trim: true }, issuer: { type: String, trim: true }, issuedAt: Date }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
