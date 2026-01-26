import { test, expect } from "@playwright/test";

test("Delete NPC flow works", async ({ page }) => {
  await page.goto("/");

  // Unique NPC name (parallel safe)
  const npcName = `Delete Flow NPC ${Date.now()}`;

  // ---------- CREATE NPC (Seed) ----------

  await page.getByTestId("create-npc-btn").click();

  const createModal = page.getByTestId("npc-form-modal");
  await expect(createModal).toBeVisible();

  await createModal.getByLabel("Name").fill(npcName);
  await createModal.getByLabel("Role").fill("Guard");

  const postPromise = page.waitForRequest(
    (req) => req.method() === "POST" && req.url().includes("/api/npcs"),
  );

  await createModal.getByTestId("form-submit-btn").click();

  const postRequest = await postPromise;
  const postPayload = JSON.parse(postRequest.postData() || "{}");

  expect(postPayload.name).toBe(npcName);
  // Close success modal
  const createCloseBtn = createModal.getByRole("button", { name: /close/i });
  await expect(createCloseBtn).toBeVisible({ timeout: 100000});
  await createCloseBtn.click();

  await expect(createModal).toBeHidden();

  // ---------- VERIFY NPC APPEARS ----------

  const npcItem = page.getByRole("list").getByText(npcName);

  await expect(npcItem).toBeVisible();

  // ---------- SELECT NPC ----------

  await npcItem.click();

  // ---------- DELETE NPC ----------

  const deleteBtn = page.getByTestId("delete-npc-btn");
  await expect(deleteBtn).toBeEnabled();
  await deleteBtn.click();
  // Confirm modal appears
  const confirmModal = page.getByRole("dialog");
  await expect(confirmModal).toBeVisible();

  // Intercept DELETE request
  const deletePromise = page.waitForRequest(
    (req) => req.method() === "DELETE" && req.url().includes("/api/npcs"),
  );

  // Confirm delete
  const confirmBtn = confirmModal.getByRole("button", { name: /^delete$/i });
  await confirmBtn.click();

  const deleteRequest = await deletePromise;
  expect(deleteRequest.method()).toBe("DELETE");
  // Confirm modal closes
  // Wait for success Close button
  const closeBtn = confirmModal.getByRole("button", { name: /close/i });
  await expect(closeBtn).toBeVisible();

  // Close modal (user action)
  await closeBtn.click();

  // Modal should now disappear
  await expect(confirmModal).toBeHidden();

  // ---------- VERIFY NPC REMOVED ----------

  await expect(page.getByRole("list").getByText(npcName)).toHaveCount(0);
});
