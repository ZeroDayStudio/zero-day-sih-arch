const express = require('express');
const { listInstitutions, createInstitution, getInstitutionReport } = require('../controllers/institutionController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { requireDatabase } = require('../middleware/databaseMiddleware');
const router = express.Router();
router.get('/', listInstitutions);
router.post('/', requireDatabase, protect, authorize('admin'), createInstitution);
router.get('/:code/report', requireDatabase, protect, authorize('institution', 'admin'), getInstitutionReport);
module.exports = router;
