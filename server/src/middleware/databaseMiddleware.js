const mongoose = require('mongoose');

function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is not connected. Start the server again or configure MONGODB_URI.',
    });
  }

  return next();
}

module.exports = { requireDatabase };