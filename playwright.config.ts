import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export const portals = {
  admin: process.env.ADMIN_BASE_URL ?? 'http://103.209.145.47:8082',
  employer: process.env.EMPLOYER_BASE_URL ?? 'http://103.209.145.47:8083',
  jobseeker: process.env.JOBSEEKER_BASE_URL ?? 'http://103.209.145.47:8084',
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
    headless: true,
    trace: 'off',
    screenshot: 'off',
    video: 'off',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
});