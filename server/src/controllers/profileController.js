const SkillProfile = require("../models/SkillProfile");
const crypto = require("crypto");

async function getProfile(req, res) {
  const profile = await SkillProfile.findOne({ userId: req.user._id }).populate(
    "skills.skillId",
  );
  return res.json({ profile });
}

async function upsertProfile(req, res) {
  const { skills = [], verificationStatus, evidenceReferences = [] } = req.body;
  const existing = await SkillProfile.findOne({ userId: req.user._id }).lean();
  const profile = await SkillProfile.findOneAndUpdate(
    { userId: req.user._id },
    {
      userId: req.user._id,
      skills,
      ...(existing?.publicSlug
        ? {}
        : { publicSlug: crypto.randomBytes(4).toString("hex") }),
      ...(verificationStatus && { verificationStatus }),
    },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  ).populate("skills.skillId");

  return res.json({ profile });
}

async function addEvidence(req, res) {
  const allowedTypes = [
    "certificate",
    "project",
    "assessment",
    "mentor_evaluation",
  ];
  if (!req.body.title || !allowedTypes.includes(req.body.type))
    return res
      .status(400)
      .json({ message: "A title and valid evidence type are required" });
  if (
    req.body.assessmentScore !== undefined &&
    (Number(req.body.assessmentScore) < 0 ||
      Number(req.body.assessmentScore) > 100)
  )
    return res
      .status(400)
      .json({ message: "Assessment score must be between 0 and 100" });
  const profile = await SkillProfile.findOneAndUpdate(
    { userId: req.user._id },
    {
      $setOnInsert: {
        userId: req.user._id,
        publicSlug: crypto.randomBytes(4).toString("hex"),
      },
      $push: {
        evidence: {
          title: req.body.title,
          type: req.body.type,
          issuer: req.body.issuer,
          linkedSkillId: req.body.linkedSkillId,
          assessmentScore: req.body.assessmentScore,
          projectUrl: req.body.projectUrl,
          fileUrl: req.file
            ? `/uploads/evidence/${req.file.filename}`
            : undefined,
        },
      },
    },
    { returnDocument: "after", upsert: true, runValidators: true },
  );
  return res.status(201).json({ profile });
}

async function getPublicProfile(req, res) {
  const profile = await SkillProfile.findOne({ publicSlug: req.params.slug })
    .populate("skills.skillId", "discipline skillNode")
    .lean();
  if (!profile)
    return res.status(404).json({ message: "Public passport not found" });
  const verifiedSkillIds = new Set(
    (profile.evidence || [])
      .filter((item) => item.status === "verified" && item.linkedSkillId)
      .map((item) => item.linkedSkillId.toString()),
  );
  const user = await require("../models/User")
    .findById(profile.userId)
    .select("name")
    .lean();
  const evidence = (profile.evidence || [])
    .filter((item) => item.status === "verified")
    .map(
      ({ _id, title, type, issuer, linkedSkillId, fileUrl, reviewedBy }) => ({
        _id,
        title,
        type,
        issuer,
        linkedSkillId,
        fileUrl,
        reviewedBy,
      }),
    );
  return res.json({
    profile: {
      name: user?.name,
      disciplines: profile.disciplines,
      location: profile.location,
      skills: profile.skills.filter(
        (skill) =>
          verifiedSkillIds.has(skill.skillId._id.toString()) ||
          verifiedSkillIds.size === 0,
      ),
      evidence,
    },
  });
}

module.exports = { getProfile, upsertProfile, addEvidence, getPublicProfile };
