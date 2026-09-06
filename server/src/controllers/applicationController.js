const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const SkillProfile = require('../models/SkillProfile');
const Match = require('../models/Match');

async function createApplication(req, res) {
  const { opportunityId, coverNote } = req.body;
  const opportunity = await Opportunity.findOne({ _id: opportunityId, status: 'open' });
  if (!opportunity) return res.status(404).json({ message: 'Open opportunity not found' });
  try {
    const application = await Application.create({ opportunityId, studentId: req.user._id, coverNote });
    return res.status(201).json({ application });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'You have already applied to this opportunity' });
    throw error;
  }
}

async function getMyApplications(req, res) {
  const applications = await Application.find({ studentId: req.user._id }).populate('opportunityId').sort({ createdAt: -1 }).lean();
  const enriched = await Promise.all(applications.map(async (application) => ({ ...application, match: await Match.findOne({ studentId: req.user._id, opportunityId: application.opportunityId._id }).select('score explanation').lean() })));
  return res.json({ applications: enriched });
}

async function getOpportunityApplications(req, res) {
  const opportunity = await Opportunity.findById(req.params.opportunityId);
  if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
  if (String(opportunity.employerId) !== String(req.user._id)) return res.status(403).json({ message: 'You do not own this opportunity' });
  const applications = await Application.find({ opportunityId: opportunity._id }).populate('studentId', 'name email institutionCode').lean();
  const enriched = await Promise.all(applications.map(async (application) => {
    const profile = await SkillProfile.findOne({ userId: application.studentId._id }).select('skills disciplines location verificationStatus').populate('skills.skillId').lean();
    const match = await Match.findOne({ studentId: application.studentId._id, opportunityId: opportunity._id }).lean();
    return { ...application, profile, match };
  }));
  return res.json({ applications: enriched });
}

async function updateApplicationStatus(req, res) {
  const allowed = ['submitted', 'under_review', 'shortlisted', 'rejected', 'accepted'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid application status' });
  const application = await Application.findById(req.params.id).populate('opportunityId');
  if (!application) return res.status(404).json({ message: 'Application not found' });
  if (String(application.opportunityId.employerId) !== String(req.user._id)) return res.status(403).json({ message: 'You do not own this opportunity' });
  application.status = req.body.status;
  await application.save();
  return res.json({ application });
}

module.exports = { createApplication, getMyApplications, getOpportunityApplications, updateApplicationStatus };
