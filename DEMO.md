# Demo Credentials

Run `cd server && npm run seed:demo` to create the complete demonstration dataset. It is idempotent and safe to run again against the same database.

All seeded demo accounts use the password `yash@123`.

| Role        | Email                                     |
| ----------- | ----------------------------------------- |
| Student     | `yash.student@demo.ayushskillsync.in`     |
| Institution | `yash.institution@demo.ayushskillsync.in` |
| Employer    | `yash.employer@demo.ayushskillsync.in`    |
| Mentor      | `yash.mentor@demo.ayushskillsync.in`      |
| Admin       | `yash.admin@demo.ayushskillsync.in`       |

The seed includes the `AYUSH-DEMO` institution, AYUSH taxonomy nodes, a student profile with verified and pending evidence, a QR passport at `demo-student`, three opportunities, explainable matches, applications across shortlisted/accepted/completed states, outcome feedback, and mentor/institution verification data.

Run `cd server && npm run seed` before the presentation. The seed is idempotent and populates taxonomy, a student profile, opportunities, evidence, and applications.

Suggested path: home -> student login -> dashboard -> match list -> opportunity -> passport -> logout -> employer login -> opportunities -> logout -> mentor/institution verification -> admin report.

Before the actual presentation, run `npm run seed` fresh and do one full dry run of this exact click path start to finish, and separately record a full backup screen-capture of a successful run, in case venue wifi or the live DB has a bad moment on stage.
