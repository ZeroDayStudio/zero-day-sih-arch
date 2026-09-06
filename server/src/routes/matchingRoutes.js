const express = require('express');
const { calculateMatch, getMyMatches } = require('../controllers/matchingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { requireDatabase } = require('../middleware/databaseMiddleware');

const router = express.Router();

router.get('/opportunities', requireDatabase, protect, authorize('student'), getMyMatches);
router.post('/:opportunityId', requireDatabase, protect, authorize('student'), calculateMatch);

module.exports = router;