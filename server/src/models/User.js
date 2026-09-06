const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['student', 'institution', 'employer', 'admin'],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);