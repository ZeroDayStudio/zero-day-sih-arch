const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const SkillProfile = require('../models/SkillProfile');

async function getAdminReport(req, res) {
  const [users, opportunities, applications, pendingVerification, profiles] = await Promise.all([
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    Opportunity.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    SkillProfile.countDocuments({ 'evidence.status': 'pending' }),
    SkillProfile.find({}).select('disciplines skills').populate('skills.skillId', 'discipline').lean(),
  ]);
  const totalApplications = applications.reduce((sum, item) => sum + item.count, 0);
  const accepted = applications.find((item) => item._id === 'accepted')?.count || 0;
  const disciplineCoverage = {};
  profiles.forEach((profile) => (profile.disciplines || []).forEach((discipline) => { disciplineCoverage[discipline] = (disciplineCoverage[discipline] || 0) + profile.skills.length; }));
  return res.json({ usersByRole: users, opportunitiesByStatus: opportunities, applicationsByStatus: applications, placementRate: totalApplications ? Math.round((accepted / totalApplications) * 100) : 0, pendingVerification, disciplineCoverage });
}
module.exports = { getAdminReport };
