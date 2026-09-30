# JobWorld portal tests

Playwright end-to-end smoke tests for the admin, employer, and jobseeker portals.

## Run

```powershell
npm install
npx playwright install chromium
Copy-Item .env.example .env
npm test
```

Set credentials in the local `.env` file to enable authenticated tests:

- `ADMIN_EMAIL` and `ADMIN_PASSWORD` test admin sign-in and primary sections.
- `EMPLOYER_EMAIL` and `EMPLOYER_PASSWORD` test employer sign-in.
- `JOBSEEKER_EMAIL` and `JOBSEEKER_PASSWORD` test jobseeker sign-in.

Unset role credentials cause only that role's authenticated test to be skipped. The public login, signup, and password-recovery screens remain covered. The tests do not submit signups, job posts, or applications.

Portal URLs can be overridden with `ADMIN_BASE_URL`, `EMPLOYER_BASE_URL`, and `JOBSEEKER_BASE_URL`. Keep real credentials in `.env`; it is excluded from Git.