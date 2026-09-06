const express = require('express');
const { getProfile, upsertProfile, addEvidence, getPublicProfile } = require('../controllers/profileController');
const { uploadEvidence } = require('../middleware/uploadMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');
const { requireDatabase } = require('../middleware/databaseMiddleware');

const router = express.Router();

router.get('/public/:slug', getPublicProfile);
router.use(requireDatabase, protect, authorize('student'));
router.get('/', getProfile);
router.put('/', upsertProfile);
router.post('/evidence', uploadEvidence.single('file'), addEvidence);

module.exports = router;