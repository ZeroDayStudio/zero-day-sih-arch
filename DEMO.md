# Demo Credentials

All seeded demo accounts use the password `Passw0rd!`.

| Role | Email |
| --- | --- |
| Student | `student@ayush.demo` |
| Institution | `institution@ayush.demo` |
| Employer | `employer@ayush.demo` |
| Mentor | `mentor@ayush.demo` |
| Admin | `admin@ayush.demo` |

Run `cd server && npm run seed` before the presentation. The seed is idempotent and populates taxonomy, a student profile, opportunities, evidence, and applications.

Suggested path: home -> student login -> dashboard -> match list -> opportunity -> passport -> logout -> employer login -> opportunities -> logout -> mentor/institution verification -> admin report.

Before the actual presentation, run `npm run seed` fresh and do one full dry run of this exact click path start to finish — and separately record a full backup screen-capture of a successful run, in case venue wifi or the live DB has a bad moment on stage.