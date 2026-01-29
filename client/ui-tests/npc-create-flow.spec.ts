import { test, expect } from "@playwright/test";

test("create NPC flow works", async ({ page }) => {
  let createRequestSeen = false;

  // -----------------------------
  // DEBUG GUARD (helps CI logs)
  // -----------------------------

  page.on("pageerror", (err) => {
    console.error("PAGE ERROR:", err.message);
  });

  // -----------------------------
  // API STUBS (CRITICAL)
  // -----------------------------

  await page.route("**/api/npcs", async (route) => {
    const req = route.request();

    // ---------- Initial NPC load ----------
    if (req.method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
      return;
    }

    // ---------- Create NPC ----------
    if (req.method() === "POST") {
      createRequestSeen = true;

      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          id: "123",
          name: "Test NPC",
          role: "Merchant",
        }),
      });
      return;
    }

    await route.continue();
  });

  // -----------------------------
  // Load app (NO networkidle)
  // -----------------------------

  await page.goto("/", { waitUntil: "domcontentloaded" });
  
  // Hard wait for React mount
  await page.waitForSelector('[data-testid="create-npc-btn"]');

  // -----------------------------
  // Open create modal
  // -----------------------------

  const createBtn = page.getByTestId("create-npc-btn");

  await expect(createBtn).toBeVisible();
  await createBtn.click();

  const modal = page.getByTestId("npc-form-modal");

  // -----------------------------
  // Wait for form fields
  // -----------------------------

  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="role"]')).toBeVisible();

  // -----------------------------
  // Fill form
  // -----------------------------

  await page.fill('input[name="name"]', "Test NPC");
  await page.fill('input[name="role"]', "Merchant");

  // Trigger validation blur
  await page.locator('input[name="name"]').blur();
  await page.locator('input[name="role"]').blur();

  // -----------------------------
  // Submit form
  // -----------------------------

  const submitBtn = page.getByTestId("form-submit-btn");

  await expect(submitBtn).toBeEnabled();
  await submitBtn.click();

  // -----------------------------
  // HARD SYNC: confirm POST fired
  // -----------------------------

  await expect.poll(() => createRequestSeen).toBe(true);

  // -----------------------------
  // Close modal
  // -----------------------------

  const closeBtn = modal.getByRole("button", { name: /close/i });

  await expect(closeBtn).toBeVisible();
  await closeBtn.click();

  await expect(modal).toBeHidden();

  // -----------------------------
  // Verify NPC appears
  // -----------------------------

  const npcListItem = page
    .getByRole("listitem")
    .filter({ hasText: "Test NPC" })
    .first();

  await expect(npcListItem).toBeVisible();
});
