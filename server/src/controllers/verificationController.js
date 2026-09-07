const SkillProfile = require("../models/SkillProfile");
const User = require("../models/User");

async function getQueue(req, res) {
  const profiles = await SkillProfile.find({ "evidence.status": "pending" })
    .populate("userId", "name email role")
    .lean();
  const queue = profiles.flatMap((profile) =>
    profile.evidence
      .filter((item) => item.status === "pending")
      .map((evidence) => ({
        ...evidence,
        student: profile.userId,
        studentUserId: profile.userId._id,
      })),
  );
  return res.json({ queue });
}

async function reviewEvidence(req, res) {
  const { status, reviewNote } = req.body;
  if (!["verified", "rejected"].includes(status))
    return res
      .status(400)
      .json({ message: "Status must be verified or rejected" });
  const profile = await SkillProfile.findOne({
    userId: req.params.studentUserId,
    "evidence._id": req.params.evidenceId,
  });
  if (!profile)
    return res.status(404).json({ message: "Evidence item not found" });
  const evidence = profile.evidence.id(req.params.evidenceId);
  evidence.status = status;
  evidence.reviewNote = reviewNote;
  evidence.reviewedBy = req.user._id;
  evidence.verificationSource = req.user.role;
  evidence.evaluatedAt = new Date();
  await profile.save();
  return res.json({ evidence });
}

module.exports = { getQueue, reviewEvidence };
