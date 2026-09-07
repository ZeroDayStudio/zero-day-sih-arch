const mongoose = require("mongoose");
const SkillTaxonomy = require("../models/SkillTaxonomy");
const { AYUSH_DISCIPLINES } = require("../constants/ayush");
const { getOrSetJson, deleteKey } = require("../config/cache");

async function getTaxonomy(req, res) {
  if (
    req.query.discipline &&
    !AYUSH_DISCIPLINES.includes(req.query.discipline)
  ) {
    return res.status(400).json({ message: "Unsupported AYUSH discipline" });
  }
  if (mongoose.connection.readyState !== 1) {
    return res.json({
      disciplines: AYUSH_DISCIPLINES,
      skills: [],
      databaseConnected: false,
    });
  }

  const filter = req.query.discipline
    ? { discipline: req.query.discipline }
    : {};
  const key = `ayush:taxonomy:${req.query.discipline || "all"}`;
  const result = await getOrSetJson(key, 300, async () => {
    const skills = await SkillTaxonomy.find(filter)
      .sort({ discipline: 1, skillNode: 1 })
      .lean();
    return { disciplines: AYUSH_DISCIPLINES, skills };
  });
  res.set("X-Cache", result.cached ? "HIT" : "MISS");
  return res.json(result.value);
}

async function createTaxonomyNode(req, res) {
  const node = await SkillTaxonomy.create(req.body);
  await deleteKey(`ayush:taxonomy:${node.discipline}`);
  await deleteKey("ayush:taxonomy:all");
  return res.status(201).json(node);
}

module.exports = { getTaxonomy, createTaxonomyNode };
