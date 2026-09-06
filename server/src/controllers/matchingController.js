/**
 * @fileoverview Explainable opportunity matching and persisted match results.
 * Combines competency, domain, eligibility, location, and availability signals
 * so each recommendation can be inspected by the student and employer.
 *
 * @author Yash Vardhan
 * @see https://github.com/Yash-pluto/zero-day-sih-arch
 */

const Match = require('../models/Match');
const Opportunity = require('../models/Opportunity');
const SkillProfile = require('../models/SkillProfile');
const { calculateMatchScore } = require('../services/matchingService');

const weights = { skillFit: 0.4, domainFit: 0.2, eligibility: 0.15, locationFit: 0.15, availability: 0.1 };
const labels = { skillFit: 'skill fit', domainFit: 'domain alignment', eligibility: 'eligibility', locationFit: 'location fit', availability: 'availability' };

function explain(result) {
  const top = Object.entries(result.breakdown).sort((a, b) => (b[1] * weights[b[0]]) - (a[1] * weights[a[0]])).slice(0, 2);
  return `Strong match driven mainly by ${labels[top[0][0]]} (${top[0][1]}%) and ${labels[top[1][0]]} (${top[1][1]}%).`;
}

async function scoreOpportunity(studentId, opportunity) {
  const profile = await SkillProfile.findOne({ userId: studentId }).lean();
  if (!profile) throw Object.assign(new Error('Skill profile not found for student'), { statusCode: 404 });
  const verifiedEvidence = (profile.evidence || []).some((item) => item.status === 'verified');
  const result = calculateMatchScore({
    studentSkills: profile.skills.map((skill) => ({ ...skill, skillId: skill.skillId.toString() })),
    studentDisciplines: profile.disciplines || [],
    studentLocation: profile.location || '',
    availability: profile.availability,
    eligibility: verifiedEvidence ? 100 : 65,
    opportunity,
  });
  return { ...result, explanation: explain(result) };
}

async function calculateMatch(req, res) {
  const opportunity = await Opportunity.findOne({ _id: req.params.opportunityId, status: 'open' }).lean();
  if (!opportunity) return res.status(404).json({ message: 'Open opportunity not found' });
  const result = await scoreOpportunity(req.user._id, opportunity);
  const match = await Match.findOneAndUpdate({ studentId: req.user._id, opportunityId: opportunity._id }, { studentId: req.user._id, opportunityId: opportunity._id, ...result }, { returnDocument: 'after', upsert: true, runValidators: true, setDefaultsOnInsert: true });
  return res.json({ match, weights });
}

async function getMyMatches(req, res) {
  const opportunities = await Opportunity.find({ status: 'open' }).sort({ createdAt: -1 }).lean();
  const matches = await Promise.all(opportunities.map(async (opportunity) => {
    const result = await scoreOpportunity(req.user._id, opportunity);
    const match = await Match.findOneAndUpdate({ studentId: req.user._id, opportunityId: opportunity._id }, { studentId: req.user._id, opportunityId: opportunity._id, ...result }, { returnDocument: 'after', upsert: true, runValidators: true, setDefaultsOnInsert: true }).lean();
    return { ...match, opportunity };
  }));
  return res.json({ matches: matches.sort((a, b) => b.score - a.score), weights });
}

module.exports = { calculateMatch, getMyMatches };
