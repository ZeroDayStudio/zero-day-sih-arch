const Institution = require('../models/Institution');
const User = require('../models/User');
const Application = require('../models/Application');
const SkillProfile = require('../models/SkillProfile');

async function listInstitutions(req, res) { return res.json({ institutions: await Institution.find({}).sort({ name: 1 }).lean() }); }
async function createInstitution(req, res) { return res.status(201).json({ institution: await Institution.create(req.body) }); }
async function getInstitutionReport(req, res) {
  if (req.user.role !== 'admin' && req.user.institutionCode !== req.params.code) return res.status(403).json({ message: 'You can only view your institution report' });
  const students = await User.find({ institutionCode: req.params.code, role: 'student' }).select('_id').lean();
  const studentIds = students.map((student) => student._id);
  const profiles = await SkillProfile.find({ userId: { $in: studentIds } }).lean();
  const applications = await Application.find({ studentId: { $in: studentIds } }).lean();
  const accepted = applications.filter((application) => application.status === 'accepted').length;
  return res.json({ report: { studentCount: students.length, profileCompleteness: students.length ? Math.round((profiles.length / students.length) * 100) : 0, placementRate: applications.length ? Math.round((accepted / applications.length) * 100) : 0, disciplineCoverage: profiles.reduce((result, profile) => { (profile.disciplines || []).forEach((discipline) => { result[discipline] = (result[discipline] || 0) + 1; }); return result; }, {}) } });
}
module.exports = { listInstitutions, createInstitution, getInstitutionReport };
