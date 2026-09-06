const express = require('express');
const { calculateMatch } = require('../controllers/matchingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { requireDatabase } = require('../middleware/databaseMiddleware');

const router = express.Router();

router.post('/', requireDatabase, protect, authorize('student', 'institution', 'employer', 'admin'), calculateMatch);

module.exports = router;