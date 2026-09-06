require('dotenv').config();

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDatabase = require('../config/database');
const User = require('../models/User');
const Institution = require('../models/Institution');
const SkillTaxonomy = require('../models/SkillTaxonomy');
const SkillProfile = require('../models/SkillProfile');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');

const password = 'Passw0rd!';
const accounts = [
  ['student@ayush.demo', 'Yash Vardhan', 'student'],
  ['institution@ayush.demo', 'AYUSH Institute Demo', 'institution'],
  ['employer@ayush.demo', 'AYUSH Employer Demo', 'employer'],
  ['mentor@ayush.demo', 'AYUSH Mentor Demo', 'mentor'],
  ['admin@ayush.demo', 'AYUSH Platform Admin', 'admin'],
];
const taxonomy = {
  Ayurveda: ['Dravyaguna Vijnana', 'Clinical reasoning', 'Panchakarma protocols', 'Ayurvedic nutrition'],
  Yoga: ['Asana practice', 'Pranayama instruction', 'Community facilitation', 'Yoga therapy'],
  Unani: ['Ilmul Advia', 'Regimental therapy', 'Clinical documentation', 'Pharmacognosy'],
  Siddha: ['Mukkutram assessment', 'Siddha pharmacology', 'Varma therapy', 'Tamil medical literature'],
  Homoeopathy: ['Materia medica', 'Case taking', 'Repertorisation', 'Patient counselling'],
};

async function upsertUser(email, name, role, institutionCode) {
  const passwordHash = await bcrypt.hash(password, 12);
  return User.findOneAndUpdate({ email }, { name, email, passwordHash, role, institutionCode }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true, runValidators: true });
}

async function seed() {
  await connectDatabase();
  console.log(`Seeding AYUSH SkillSync demo data into MongoDB database: ${mongoose.connection.name}`);
  const institution = await Institution.findOneAndUpdate({ code: 'AYUSH-DEMO' }, { name: 'AYUSH Institute Demo', code: 'AYUSH-DEMO', programs: ['BAMS', 'BNYS', 'B.Pharm'], curriculumMap: [] }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true });
  const skills = {};
  for (const [discipline, nodes] of Object.entries(taxonomy)) for (const skillNode of nodes) skills[skillNode] = await SkillTaxonomy.findOneAndUpdate({ discipline, skillNode }, { discipline, skillNode }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true });
  const users = {};
  for (const [email, name, role] of accounts) users[role] = await upsertUser(email, name, role, role === 'student' ? institution.code : undefined);
  await SkillProfile.findOneAndUpdate({ userId: users.student._id }, { userId: users.student._id, publicSlug: 'demo-student', disciplines: ['Ayurveda', 'Yoga'], location: 'Pune, Maharashtra', education: 'BAMS · Year 4', availability: 85, skills: [{ skillId: skills['Clinical reasoning']._id, proficiency: 86 }, { skillId: skills['Dravyaguna Vijnana']._id, proficiency: 72 }, { skillId: skills['Community facilitation']._id, proficiency: 64 }], evidence: [{ title: 'Clinical research certificate', type: 'certificate', issuer: 'AYUSH Institute Demo', linkedSkillId: skills['Clinical reasoning']._id, status: 'verified' }, { title: 'Community care project', type: 'project', issuer: 'Student portfolio', linkedSkillId: skills['Community facilitation']._id, status: 'pending' }] }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true, runValidators: true });
  const opportunityData = [
    { title: 'Clinical Research Fellow', type: 'internship', disciplines: ['Ayurveda'], location: 'Pune, Maharashtra', requiredSkills: [skills['Clinical reasoning']._id, skills['Dravyaguna Vijnana']._id], description: 'Support structured clinical documentation and evidence-led research.', stipend: 18000 },
    { title: 'Community Yoga Facilitator', type: 'fellowship', disciplines: ['Yoga'], location: 'Remote', remote: true, requiredSkills: [skills['Community facilitation']._id, skills['Pranayama instruction']._id], description: 'Deliver community-centred wellbeing sessions.', stipend: 22000 },
    { title: 'AYUSH Digital Health Associate', type: 'placement', disciplines: ['Ayurveda', 'Yoga'], location: 'Bengaluru, Karnataka', requiredSkills: [skills['Clinical documentation']?._id || skills['Clinical reasoning']._id], description: 'Translate AYUSH practice into structured digital records.', stipend: 32000 },
  ];
  const opportunities = [];
  for (const data of opportunityData) opportunities.push(await Opportunity.findOneAndUpdate({ employerId: users.employer._id, title: data.title }, { ...data, employerId: users.employer._id, status: 'open' }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true, runValidators: true }));
  await Application.findOneAndUpdate({ opportunityId: opportunities[0]._id, studentId: users.student._id }, { opportunityId: opportunities[0]._id, studentId: users.student._id, status: 'shortlisted', coverNote: 'I bring verified clinical reasoning and research evidence.' }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true });
  await Application.findOneAndUpdate({ opportunityId: opportunities[1]._id, studentId: users.student._id }, { opportunityId: opportunities[1]._id, studentId: users.student._id, status: 'accepted', coverNote: 'My community facilitation evidence aligns with this fellowship.' }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true });
  console.log('Seed complete. All demo accounts use password Passw0rd!');
  accounts.forEach(([email, , role]) => console.log(`${role}: ${email}`));
}

seed().then(() => mongoose.disconnect()).catch(async (error) => { console.error(`Seed failed: ${error.message}`); await mongoose.disconnect(); process.exitCode = 1; });
