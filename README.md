# AYUSH SkillSync

AYUSH SkillSync is the SIH26044 Academia-Industry Portal for skill mapping, internships, and placement. It is developed by Team Zero Day.

## Run locally

The MongoDB Atlas connection is read from `server/.env`.

```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
npm run dev
```

The client runs on `http://localhost:3000` and the API runs on `http://localhost:5000` by default.

To seed or refresh the local demo accounts:

```bash
cd server
npm run seed:demo
```

All demo accounts use the password `yash@123` and the display name `Yash Vardhan`:

| Role | Login email |
| --- | --- |
| Student | `yash.student@demo.ayushskillsync.in` |
| Institution | `yash.institution@demo.ayushskillsync.in` |
| Employer | `yash.employer@demo.ayushskillsync.in` |
| Mentor | `yash.mentor@demo.ayushskillsync.in` |
| Administrator | `yash.admin@demo.ayushskillsync.in` |

## Validation

```bash
cd client && npm run build
cd ../server && npm run seed:demo
```

The matching API uses the explainable weighted model: 40% skill compatibility, 20% domain fit, 15% eligibility, 15% preference/location fit, and 10% availability.
# .github-template