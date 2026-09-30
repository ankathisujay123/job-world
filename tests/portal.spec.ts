import { expect, test } from '@playwright/test';
import { portals } from '../playwright.config';

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const employerEmail = process.env.EMPLOYER_EMAIL;
const employerPassword = process.env.EMPLOYER_PASSWORD;
const jobseekerEmail = process.env.JOBSEEKER_EMAIL;
const jobseekerPassword = process.env.JOBSEEKER_PASSWORD;

test.describe('Admin portal', () => {
  test('shows the admin login form', async ({ page }) => {
    await page.goto(`${portals.admin}/login`);

    await expect(page.getByRole('heading', { name: /admin login/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /admin email/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /^password$/i })).toBeVisible();
  });

  test('admin can sign in and open each primary section', async ({ page }) => {
    test.skip(!adminEmail || !adminPassword, 'Set ADMIN_EMAIL and ADMIN_PASSWORD to run authenticated tests.');

    await page.goto(`${portals.admin}/login`);
    await page.getByRole('textbox', { name: /admin email/i }).fill(adminEmail!);
    await page.getByRole('textbox', { name: /^password$/i }).fill(adminPassword!);
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/overview$/);
    await expect(page.getByText('Platform overview')).toBeVisible();

    const sections = [
      { name: /^Overview/, path: '/overview', heading: 'Platform overview' },
      { name: /^Analytics/, path: '/analytics', heading: 'Platform analytics' },
      { name: /^Jobseekers/, path: '/jobseekers', heading: 'Jobseekers' },
      { name: /^Employers/, path: '/employers', heading: 'Employers' },
      { name: /^Job listings/, path: '/jobs', heading: 'Job listings' },
      { name: /^Applicants/, path: '/applicants', heading: 'Applicants' },
      { name: /^Admin team/, path: '/team', heading: 'Admin Team' },
      { name: /^Settings/, path: '/settings', heading: 'Platform settings' },
    ];

    for (const section of sections) {
      await expect(page.getByRole('link', { name: section.name })).toHaveAttribute('href', section.path);
      await page.goto(`${portals.admin}${section.path}`);
      await expect(page).toHaveURL(new RegExp(`${section.path}$`));
      await expect(page.locator('main h1, main h2').first()).toHaveText(section.heading);
    }
  });
});

test.describe('Employer portal', () => {
  test('login, signup, and recovery screens are reachable', async ({ page }) => {
    await page.goto(`${portals.employer}/employer/login`);
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Work email' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log in' })).toBeDisabled();

    await page.getByRole('link', { name: 'Forgot password?' }).click();
    await expect(page).toHaveURL(/\/employer\/forgot-password$/);
    await expect(page.getByRole('heading', { name: 'Forgot your password?' })).toBeVisible();

    await page.getByRole('link', { name: /back to log in/i }).click();
    await page.getByRole('link', { name: 'Create an employer account' }).click();
    await expect(page).toHaveURL(/\/employer\/signup$/);
  });

  test('employer can sign in', async ({ page }) => {
    test.skip(!employerEmail || !employerPassword, 'Set EMPLOYER_EMAIL and EMPLOYER_PASSWORD to run authenticated tests.');

    await page.goto(`${portals.employer}/employer/login`);
    await page.getByRole('textbox', { name: 'Work email' }).fill(employerEmail!);
    await page.getByRole('textbox', { name: 'Password' }).fill(employerPassword!);
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).not.toHaveURL(/\/employer\/login/);
    await expect(page.locator('main')).toBeVisible();
  });
});

test.describe('Jobseeker portal', () => {
  test('login, signup, and recovery screens are reachable', async ({ page }) => {
    await page.goto(`${portals.jobseeker}/`);
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email*' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password*' })).toBeVisible();

    await page.getByRole('link', { name: 'Create an account' }).click();
    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Full name *' })).toBeVisible();

    await page.getByRole('link', { name: 'Sign in' }).click();
    await page.getByRole('link', { name: 'Forgot password?' }).click();
    await expect(page).toHaveURL(/\/forgot-password$/);
  });

  test('jobseeker can sign in', async ({ page }) => {
    test.skip(!jobseekerEmail || !jobseekerPassword, 'Set JOBSEEKER_EMAIL and JOBSEEKER_PASSWORD to run authenticated tests.');

    await page.goto(`${portals.jobseeker}/login`);
    await page.getByRole('textbox', { name: 'Email*' }).fill(jobseekerEmail!);
    await page.getByRole('textbox', { name: 'Password*' }).fill(jobseekerPassword!);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).not.toHaveURL(/\/login$/);
    await expect(page.locator('main')).toBeVisible();
  });
});