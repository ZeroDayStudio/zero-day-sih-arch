const Match = require('../models/Match');
const SkillProfile = require('../models/SkillProfile');
const { calculateMatchScore } = require('../services/matchingService');

async function calculateMatch(req, res) {
  const { studentId, opportunityId, studentDisciplines = [], studentLocation = '', availability = 100, eligibility = 100, opportunity } = req.body;
  if (!studentId || !opportunityId || !opportunity) {
    return res.status(400).json({ message: 'studentId, opportunityId, and opportunity are required' });
  }

  const profile = await SkillProfile.findOne({ userId: studentId }).lean();
  if (!profile) return res.status(404).json({ message: 'Skill profile not found for student' });

  const result = calculateMatchScore({
    studentSkills: profile.skills.map((skill) => ({ ...skill, skillId: skill.skillId.toString() })),
    studentDisciplines,
    studentLocation,
    availability,
    eligibility,
    opportunity,
  });

  const match = await Match.findOneAndUpdate(
    { studentId, opportunityId },
    { studentId, opportunityId, ...result },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  return res.json({ match, weights: { skillFit: 0.4, domainFit: 0.2, eligibility: 0.15, locationFit: 0.15, availability: 0.1 } });
}

module.exports = { calculateMatch };