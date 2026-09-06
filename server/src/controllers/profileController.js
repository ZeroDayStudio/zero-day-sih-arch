const SkillProfile = require('../models/SkillProfile');

async function getProfile(req, res) {
  const profile = await SkillProfile.findOne({ userId: req.user._id }).populate('skills.skillId');
  return res.json({ profile });
}

async function upsertProfile(req, res) {
  const { skills = [], verificationStatus, evidenceReferences = [] } = req.body;
  const profile = await SkillProfile.findOneAndUpdate(
    { userId: req.user._id },
    { userId: req.user._id, skills, evidenceReferences, ...(verificationStatus && { verificationStatus }) },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).populate('skills.skillId');

  return res.json({ profile });
}

module.exports = { getProfile, upsertProfile };