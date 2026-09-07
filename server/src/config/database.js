const mongoose = require('mongoose');

let memoryServer;

function hasUsableMongoUri(mongoUri) {
  return Boolean(mongoUri && !mongoUri.includes('<username>') && !mongoUri.includes('<password>') && !mongoUri.includes('<cluster>'));
}

async function connectDatabase() {
  let mongoUri = process.env.MONGODB_URI;

  if (!hasUsableMongoUri(mongoUri)) {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('MONGODB_URI is required outside development');
    }

    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    mongoUri = memoryServer.getUri();
    console.warn('MONGODB_URI is not configured; using an ephemeral development database');
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

async function disconnectDatabase() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = undefined;
  }
}

module.exports = connectDatabase;
module.exports.disconnectDatabase = disconnectDatabase;