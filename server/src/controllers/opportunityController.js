const Opportunity = require('../models/Opportunity');

function publicFilter(req) {
  const filter = { status: 'open' };
  if (req.query.discipline) filter.disciplines = req.query.discipline;
  if (req.query.location) filter.location = new RegExp(String(req.query.location), 'i');
  if (req.query.remote !== undefined) filter.remote = req.query.remote === 'true';
  if (req.query.type) filter.type = req.query.type;
  if (req.query.q) filter.title = new RegExp(String(req.query.q), 'i');
  return filter;
}

async function listOpportunities(req, res) {
  const filter = publicFilter(req);
  if (req.user && ['employer', 'admin'].includes(req.user.role)) delete filter.status;
  const opportunities = await Opportunity.find(filter).populate('requiredSkills').populate('employerId', 'name').sort({ createdAt: -1 }).lean();
  return res.json({ opportunities });
}

async function getOpportunity(req, res) {
  const opportunity = await Opportunity.findById(req.params.id).populate('requiredSkills').populate('employerId', 'name').lean();
  if (!opportunity || (opportunity.status !== 'open' && (!req.user || (String(opportunity.employerId?._id) !== String(req.user._id) && req.user.role !== 'admin')))) return res.status(404).json({ message: 'Opportunity not found' });
  return res.json({ opportunity });
}

async function createOpportunity(req, res) {
  const opportunity = await Opportunity.create({ ...req.body, employerId: req.user._id });
  return res.status(201).json({ opportunity });
}

async function updateOpportunity(req, res) {
  const opportunity = await Opportunity.findById(req.params.id);
  if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
  if (String(opportunity.employerId) !== String(req.user._id)) return res.status(403).json({ message: 'You can only edit your own opportunities' });
  Object.assign(opportunity, req.body);
  await opportunity.save();
  return res.json({ opportunity });
}

async function deleteOpportunity(req, res) {
  const opportunity = await Opportunity.findById(req.params.id);
  if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
  if (String(opportunity.employerId) !== String(req.user._id)) return res.status(403).json({ message: 'You can only delete your own opportunities' });
  await opportunity.deleteOne();
  return res.status(204).send();
}

module.exports = { listOpportunities, getOpportunity, createOpportunity, updateOpportunity, deleteOpportunity };
