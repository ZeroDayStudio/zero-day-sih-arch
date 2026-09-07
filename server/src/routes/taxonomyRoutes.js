const express = require("express");
const {
  getTaxonomy,
  createTaxonomyNode,
} = require("../controllers/taxonomyController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { requireDatabase } = require("../middleware/databaseMiddleware");

const router = express.Router();

router.get("/", getTaxonomy);
router.post(
  "/",
  requireDatabase,
  protect,
  authorize("institution", "mentor", "admin"),
  createTaxonomyNode,
);

module.exports = router;
