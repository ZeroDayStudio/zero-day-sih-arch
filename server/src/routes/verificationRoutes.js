const express = require('express');
const { getQueue, reviewEvidence } = require('../controllers/verificationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { requireDatabase } = require('../middleware/databaseMiddleware');

const router = express.Router();
router.use(requireDatabase, protect, authorize('institution', 'mentor', 'admin'));
router.get('/queue', getQueue);
router.patch('/:studentUserId/:evidenceId', reviewEvidence);
module.exports = router;
