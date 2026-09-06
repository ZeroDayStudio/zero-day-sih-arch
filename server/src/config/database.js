const mongoose = require('mongoose');

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('MONGODB_URI is not configured; starting without database access');
    return false;
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required to start the server');
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`MongoDB connected: ${mongoose.connection.name}`);
  return true;
}

module.exports = connectDatabase;