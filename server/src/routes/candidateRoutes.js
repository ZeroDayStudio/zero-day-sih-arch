const express = require('express');
const { searchCandidates } = require('../controllers/candidateController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { requireDatabase } = require('../middleware/databaseMiddleware');
const router = express.Router();
router.get('/search', requireDatabase, protect, authorize('institution', 'employer', 'admin'), searchCandidates);
module.exports = router;
