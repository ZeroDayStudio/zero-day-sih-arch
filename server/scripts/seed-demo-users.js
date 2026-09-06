require('dotenv').config();

const bcrypt = require('bcryptjs');
const connectDatabase = require('../src/config/database');
const User = require('../src/models/User');

const demoPassword = 'yash@123';
const demoUsers = [
  { email: 'yash.student@demo.ayushskillsync.in', role: 'student' },
  { email: 'yash.institution@demo.ayushskillsync.in', role: 'institution' },
  { email: 'yash.employer@demo.ayushskillsync.in', role: 'employer' },
  { email: 'yash.mentor@demo.ayushskillsync.in', role: 'mentor' },
  { email: 'yash.admin@demo.ayushskillsync.in', role: 'admin' },
];

async function seedDemoUsers() {
  await connectDatabase();
  const passwordHash = await bcrypt.hash(demoPassword, 12);

  for (const account of demoUsers) {
    await User.findOneAndUpdate(
      { email: account.email },
      { name: 'Yash Vardhan', email: account.email, passwordHash, role: account.role },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true, runValidators: true }
    );
  }

  console.log(`Seeded ${demoUsers.length} demo users. Password: ${demoPassword}`);
  demoUsers.forEach(({ email, role }) => console.log(`${role}: ${email}`));
}

seedDemoUsers()
  .then(async () => {
    const mongoose = require('mongoose');
    await mongoose.disconnect();
  })
  .catch(async (error) => {
    console.error(`Demo user seeding failed: ${error.message}`);
    const mongoose = require('mongoose');
    await mongoose.disconnect();
    process.exitCode = 1;
  });
