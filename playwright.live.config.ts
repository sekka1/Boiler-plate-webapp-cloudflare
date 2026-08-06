import { defineConfig } from "@playwright/test";

// Runs a small smoke test suite against the *deployed* live site (as opposed
// to `playwright.config.ts`, which spins up a local preview server). This is
// intended to be run as a post-deploy step in CI after publishing to
// Cloudflare Workers, but can also be run manually:
//
//   LIVE_URL=https://real-estate-referral-portal.garlandk.workers.dev \
//   E2E_TEST_EMAIL=partner@example.com \
//   E2E_TEST_PASSWORD=<your-test-password> \
//   npm run test:e2e:live
export default defineConfig({
  testDir: "./e2e-live",
  fullyParallel: true,
  retries: 2,
  reporter: [["html", { open: "never", outputFolder: "playwright-report-live" }]],
  use: {
    baseURL: process.env.LIVE_URL ?? "https://real-estate-referral-portal.garlandk.workers.dev",
    trace: "on-first-retry",
  },
});
