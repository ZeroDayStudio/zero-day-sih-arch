const mongoose = require('mongoose');

function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is not connected. Configure MONGODB_URI to use this endpoint.',
    });
  }

  return next();
}

module.exports = { requireDatabase };