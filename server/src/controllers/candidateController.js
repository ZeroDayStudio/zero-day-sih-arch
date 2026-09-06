const SkillProfile = require('../models/SkillProfile');
const User = require('../models/User');

async function searchCandidates(req, res) {
  const profiles = await SkillProfile.find({ ...(req.query.discipline ? { disciplines: req.query.discipline } : {}), ...(req.query.location ? { location: new RegExp(String(req.query.location), 'i') } : {}) }).populate('skills.skillId', 'discipline skillNode').lean();
  const candidates = profiles.map((profile) => {
    const skills = profile.skills.filter((skill) => !req.query.skill || skill.skillId.skillNode.toLowerCase().includes(String(req.query.skill).toLowerCase())).sort((a, b) => b.proficiency - a.proficiency).slice(0, 5);
    return { name: null, userId: profile.userId, disciplines: profile.disciplines, location: profile.location, topVerifiedSkills: skills, profileStrength: skills.length ? Math.round(skills.reduce((sum, skill) => sum + skill.proficiency, 0) / skills.length) : 0 };
  });
  const users = await User.find({ _id: { $in: candidates.map((candidate) => candidate.userId) } }).select('name').lean();
  const names = new Map(users.map((user) => [user._id.toString(), user.name]));
  return res.json({ candidates: candidates.map((candidate) => ({ ...candidate, name: names.get(candidate.userId.toString()) })) });
}
module.exports = { searchCandidates };
