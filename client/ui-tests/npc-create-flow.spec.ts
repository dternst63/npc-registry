import { test, expect } from "@playwright/test";

test("create NPC flow works", async ({ page }) => {
  let createRequestSeen = false;

  // ---- Intercept ONLY create NPC call ----
  await page.route("**/api/npcs", async (route) => {
    const req = route.request();

    if (req.method() === "POST") {
      createRequestSeen = true;

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "123",
          name: "Test NPC",
          role: "Merchant",
        }),
      });
    } else {
      await route.continue();
    }
  });

  // ---- Load app ----
  await page.goto("/", { waitUntil: "networkidle" });

  // ---- Open create modal ----
  const createBtn = page.getByTestId("create-npc-btn");

  await expect(createBtn).toBeVisible({ timeout: 15000 });
  await createBtn.click();

  const modal = page.getByTestId("npc-form-modal");

  // ---- Wait for form ----
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="role"]')).toBeVisible();

  // ---- Fill form ----
  await page.fill('input[name="name"]', "Test NPC");
  await page.fill('input[name="role"]', "Merchant");

  // ---- Trigger blur validation ----
  await page.locator('input[name="name"]').blur();
  await page.locator('input[name="role"]').blur();

  // ---- Submit form ----
  const submitBtn = page.getByTestId("form-submit-btn");

  await expect(submitBtn).toBeEnabled();
  await submitBtn.click();

  // ---- HARD SYNC: confirm POST fired ----
  await expect.poll(() => createRequestSeen).toBe(true);

  // ---- Confirm modal closed ----
  await expect(modal).toBeHidden({ timeout: 10000 });

  // ---- Verify new NPC appears in list ----
  const npcListItem = page
    .getByRole("listitem")
    .filter({ hasText: "Test NPC" })
    .first();

  await expect(npcListItem).toBeVisible();
});
