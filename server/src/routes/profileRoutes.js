const express = require('express');
const { getProfile, upsertProfile } = require('../controllers/profileController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { requireDatabase } = require('../middleware/databaseMiddleware');

const router = express.Router();

router.use(requireDatabase, protect, authorize('student'));
router.get('/', getProfile);
router.put('/', upsertProfile);

module.exports = router;