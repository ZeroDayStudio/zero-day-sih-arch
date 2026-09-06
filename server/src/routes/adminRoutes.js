const express = require('express');
const { getAdminReport } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { requireDatabase } = require('../middleware/databaseMiddleware');
const router = express.Router();
router.get('/report', requireDatabase, protect, authorize('admin'), getAdminReport);
module.exports = router;
