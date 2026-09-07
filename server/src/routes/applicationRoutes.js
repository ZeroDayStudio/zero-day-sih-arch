const express = require("express");
const {
  createApplication,
  getMyApplications,
  getOpportunityApplications,
  updateApplicationStatus,
  updateApplicationOutcome,
} = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { requireDatabase } = require("../middleware/databaseMiddleware");

const router = express.Router();
router.use(requireDatabase, protect);
router.post("/", authorize("student"), createApplication);
router.get("/me", authorize("student"), getMyApplications);
router.get(
  "/opportunity/:opportunityId",
  authorize("employer"),
  getOpportunityApplications,
);
router.patch("/:id/status", authorize("employer"), updateApplicationStatus);
router.patch(
  "/:id/outcome",
  authorize("student", "employer"),
  updateApplicationOutcome,
);
module.exports = router;
