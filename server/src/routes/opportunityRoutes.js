const express = require('express');
const { listOpportunities, getOpportunity, createOpportunity, updateOpportunity, deleteOpportunity } = require('../controllers/opportunityController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { requireDatabase } = require('../middleware/databaseMiddleware');

const router = express.Router();
router.get('/', listOpportunities);
router.get('/:id', getOpportunity);
router.post('/', requireDatabase, protect, authorize('employer'), createOpportunity);
router.patch('/:id', requireDatabase, protect, authorize('employer'), updateOpportunity);
router.delete('/:id', requireDatabase, protect, authorize('employer'), deleteOpportunity);
module.exports = router;
