require('dotenv').config();

const app = require('./src/app');
const connectDatabase = require('./src/config/database');

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'local-development-secret-change-me';
    console.warn('JWT_SECRET is not configured; using a development-only secret');
  }

  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`AYUSH platform API listening on port ${PORT}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error(`Unable to start server: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { app, startServer };