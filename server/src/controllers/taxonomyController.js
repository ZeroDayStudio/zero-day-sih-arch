const mongoose = require('mongoose');
const SkillTaxonomy = require('../models/SkillTaxonomy');
const { AYUSH_DISCIPLINES } = require('../constants/ayush');

async function getTaxonomy(req, res) {
  if (req.query.discipline && !AYUSH_DISCIPLINES.includes(req.query.discipline)) {
    return res.status(400).json({ message: 'Unsupported AYUSH discipline' });
  }
  if (mongoose.connection.readyState !== 1) {
    return res.json({ disciplines: AYUSH_DISCIPLINES, skills: [], databaseConnected: false });
  }

  const filter = req.query.discipline ? { discipline: req.query.discipline } : {};
  const skills = await SkillTaxonomy.find(filter).sort({ discipline: 1, skillNode: 1 }).lean();
  return res.json({ disciplines: AYUSH_DISCIPLINES, skills });
}

async function createTaxonomyNode(req, res) {
  const node = await SkillTaxonomy.create(req.body);
  return res.status(201).json(node);
}

module.exports = { getTaxonomy, createTaxonomyNode };