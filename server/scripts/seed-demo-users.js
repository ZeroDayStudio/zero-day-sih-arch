require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDatabase = require("../src/config/database");
const User = require("../src/models/User");
const Institution = require("../src/models/Institution");
const SkillTaxonomy = require("../src/models/SkillTaxonomy");
const SkillProfile = require("../src/models/SkillProfile");
const Opportunity = require("../src/models/Opportunity");
const Application = require("../src/models/Application");
const Match = require("../src/models/Match");

const demoPassword = "yash@123";
const institutionCode = "AYUSH-DEMO";
const accounts = [
  {
    key: "student",
    email: "yash.student@demo.ayushskillsync.in",
    name: "Yash Vardhan",
    role: "student",
  },
  {
    key: "institution",
    email: "yash.institution@demo.ayushskillsync.in",
    name: "AYUSH Institute Demo",
    role: "institution",
  },
  {
    key: "employer",
    email: "yash.employer@demo.ayushskillsync.in",
    name: "AYUSH Employer Demo",
    role: "employer",
  },
  {
    key: "mentor",
    email: "yash.mentor@demo.ayushskillsync.in",
    name: "AYUSH Mentor Demo",
    role: "mentor",
  },
  {
    key: "admin",
    email: "yash.admin@demo.ayushskillsync.in",
    name: "AYUSH Platform Admin",
    role: "admin",
  },
];

const taxonomy = {
  Ayurveda: [
    "Dravyaguna Vijnana",
    "Clinical reasoning",
    "Panchakarma protocols",
    "Ayurvedic nutrition",
  ],
  Yoga: [
    "Asana practice",
    "Pranayama instruction",
    "Community facilitation",
    "Yoga therapy",
  ],
  Unani: [
    "Ilmul Advia",
    "Regimental therapy",
    "Clinical documentation",
    "Pharmacognosy",
  ],
  Siddha: [
    "Mukkutram assessment",
    "Siddha pharmacology",
    "Varma therapy",
    "Tamil medical literature",
  ],
  Homoeopathy: [
    "Materia medica",
    "Case taking",
    "Repertorisation",
    "Patient counselling",
  ],
  "Sowa-Rigpa": ["Traditional diagnosis", "External therapies"],
  "Allied AYUSH": ["AYUSH public health", "Digital health documentation"],
};

async function upsertUser(account, passwordHash) {
  return User.findOneAndUpdate(
    { email: account.email },
    {
      name: account.name,
      email: account.email,
      passwordHash,
      role: account.role,
      ...(account.role === "student" ? { institutionCode } : {}),
    },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  );
}

async function upsertProfile(userId, data) {
  const existingProfile = await SkillProfile.findOne({ userId });
  if (!existingProfile && data.publicSlug) {
    const profileWithSlug = await SkillProfile.findOne({
      publicSlug: data.publicSlug,
    });
    if (profileWithSlug) {
      return SkillProfile.findOneAndUpdate(
        { _id: profileWithSlug._id },
        { userId, ...data },
        {
          returnDocument: "after",
          setDefaultsOnInsert: true,
          runValidators: true,
        },
      );
    }
  }

  if (existingProfile && data.publicSlug !== existingProfile.publicSlug) {
    await SkillProfile.updateOne(
      { publicSlug: data.publicSlug, userId: { $ne: userId } },
      { $unset: { publicSlug: 1 } },
    );
  }

  return SkillProfile.findOneAndUpdate(
    { userId },
    { userId, ...data },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  );
}

async function seedDemoData() {
  await connectDatabase();
  const passwordHash = await bcrypt.hash(demoPassword, 12);
  const users = {};
  for (const account of accounts)
    users[account.key] = await upsertUser(account, passwordHash);

  await Institution.findOneAndUpdate(
    { code: institutionCode },
    {
      name: "AYUSH Institute Demo",
      code: institutionCode,
      programs: ["BAMS", "BNYS", "BUMS", "BSMS", "BHMS"],
      curriculumMap: [
        {
          course: "Clinical practice",
          skills: ["Clinical reasoning", "Patient counselling"],
        },
        {
          course: "Community health",
          skills: ["Community facilitation", "AYUSH public health"],
        },
      ],
    },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  );

  const skills = {};
  for (const [discipline, nodes] of Object.entries(taxonomy))
    for (const skillNode of nodes)
      skills[skillNode] = await SkillTaxonomy.findOneAndUpdate(
        { discipline, skillNode },
        { discipline, skillNode },
        {
          upsert: true,
          returnDocument: "after",
          setDefaultsOnInsert: true,
          runValidators: true,
        },
      );

  await upsertProfile(users.student._id, {
    publicSlug: "demo-student",
    disciplines: ["Ayurveda", "Yoga"],
    location: "Pune, Maharashtra",
    education: "BAMS · Year 4",
    availability: 85,
    skills: [
      { skillId: skills["Clinical reasoning"]._id, proficiency: 86 },
      { skillId: skills["Dravyaguna Vijnana"]._id, proficiency: 72 },
      { skillId: skills["Community facilitation"]._id, proficiency: 64 },
      { skillId: skills["Pranayama instruction"]._id, proficiency: 78 },
    ],
    evidence: [
      {
        title: "Clinical research certificate",
        type: "certificate",
        issuer: "AYUSH Institute Demo",
        linkedSkillId: skills["Clinical reasoning"]._id,
        status: "verified",
        reviewedBy: users.mentor._id,
        verificationSource: "mentor",
        evaluatedAt: new Date(),
      },
      {
        title: "Community care project",
        type: "project",
        issuer: "Student portfolio",
        linkedSkillId: skills["Community facilitation"]._id,
        projectUrl: "https://example.com/demo-community-project",
        status: "pending",
      },
      {
        title: "AYUSH readiness assessment",
        type: "assessment",
        issuer: "AYUSH Institute Demo",
        linkedSkillId: skills["Pranayama instruction"]._id,
        assessmentScore: 82,
        status: "verified",
        reviewedBy: users.institution._id,
        verificationSource: "institution",
        evaluatedAt: new Date(),
      },
    ],
  });
  await upsertProfile(users.mentor._id, {
    publicSlug: "demo-mentor",
    disciplines: ["Yoga"],
    location: "Delhi, India",
    education: "MSc Yoga Therapy",
    skills: [{ skillId: skills["Yoga therapy"]._id, proficiency: 94 }],
    evidence: [],
  });

  const opportunityData = [
    {
      title: "Clinical Research Fellow",
      type: "internship",
      disciplines: ["Ayurveda"],
      location: "Pune, Maharashtra",
      requiredSkills: [
        skills["Clinical reasoning"]._id,
        skills["Dravyaguna Vijnana"]._id,
      ],
      description:
        "Support structured clinical documentation and evidence-led research.",
      stipend: 18000,
    },
    {
      title: "Community Yoga Facilitator",
      type: "fellowship",
      disciplines: ["Yoga"],
      location: "Remote",
      remote: true,
      requiredSkills: [
        skills["Community facilitation"]._id,
        skills["Pranayama instruction"]._id,
      ],
      description: "Deliver community-centred wellbeing sessions.",
      stipend: 22000,
    },
    {
      title: "AYUSH Digital Health Associate",
      type: "placement",
      disciplines: ["Ayurveda", "Yoga"],
      location: "Bengaluru, Karnataka",
      requiredSkills: [
        skills["Clinical documentation"]._id,
        skills["Clinical reasoning"]._id,
      ],
      description: "Translate AYUSH practice into structured digital records.",
      stipend: 32000,
    },
  ];
  const opportunities = [];
  for (const data of opportunityData)
    opportunities.push(
      await Opportunity.findOneAndUpdate(
        { employerId: users.employer._id, title: data.title },
        { ...data, employerId: users.employer._id, status: "open" },
        {
          upsert: true,
          returnDocument: "after",
          setDefaultsOnInsert: true,
          runValidators: true,
        },
      ),
    );

  const applicationData = [
    {
      opportunityId: opportunities[0]._id,
      status: "shortlisted",
      coverNote: "I bring verified clinical reasoning and research evidence.",
    },
    {
      opportunityId: opportunities[1]._id,
      status: "accepted",
      coverNote:
        "My community facilitation evidence aligns with this fellowship.",
    },
    {
      opportunityId: opportunities[2]._id,
      status: "completed",
      coverNote: "I can translate clinical practice into structured records.",
      outcome: {
        completedAt: new Date(),
        employerRating: 5,
        employerFeedback: "Strong documentation and collaboration.",
        studentFeedback: "Improved my digital health practice.",
        curriculumFeedback:
          "Add more structured clinical documentation modules.",
      },
    },
  ];
  for (const data of applicationData) {
    await Application.findOneAndUpdate(
      { opportunityId: data.opportunityId, studentId: users.student._id },
      { ...data, studentId: users.student._id },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );
    await Match.findOneAndUpdate(
      { studentId: users.student._id, opportunityId: data.opportunityId },
      {
        studentId: users.student._id,
        opportunityId: data.opportunityId,
        score: data.opportunityId.equals(opportunities[0]._id) ? 82 : 76,
        breakdown: {
          skillFit: 86,
          domainFit: 100,
          eligibility: 100,
          locationFit: 100,
          availability: 85,
        },
        explanation:
          "Strong match driven mainly by skill fit (86%) and domain alignment (100%).",
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );
  }

  console.log(
    `Seeded ${accounts.length} demo users and linked demo content. Password: ${demoPassword}`,
  );
  accounts.forEach(({ email, role }) => console.log(`${role}: ${email}`));
}

seedDemoData()
  .then(() => mongoose.disconnect())
  .catch(async (error) => {
    console.error(`Demo data seeding failed: ${error.message}`);
    await mongoose.disconnect();
    process.exitCode = 1;
  });
