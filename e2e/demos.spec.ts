import { expect, test } from "@playwright/test";

test.describe("Design demos", () => {
  test("unauthenticated user is redirected away from the demos hub", async ({ page }) => {
    await page.goto("/demos");
    await expect(page).toHaveURL(/sign-in/);
  });

  test("unauthenticated user is redirected away from a demo page", async ({ page }) => {
    await page.goto("/demos/analytics");
    await expect(page).toHaveURL(/sign-in/);
  });
});
