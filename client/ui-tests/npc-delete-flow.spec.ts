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

  // Submit + wait for backend response
  await Promise.all([
    page.waitForResponse((res) =>
      res.url().includes("/api/npcs") && res.status() === 200
    ),
    createModal.getByTestId("form-submit-btn").click(),
  ]);

  // Modal should close after successful create
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

  // Confirm dialog appears
  const confirmModal = page.getByRole("dialog");
  await expect(confirmModal).toBeVisible();

  // Confirm delete + wait for backend response
  await Promise.all([
    page.waitForResponse((res) =>
      res.url().includes("/api/npcs") && res.status() === 200
    ),
    confirmModal.getByRole("button", { name: /^delete$/i }).click(),
  ]);

  // Confirm modal should close
  await expect(confirmModal).toBeHidden();

  // ---------- VERIFY NPC REMOVED ----------

  await expect(page.getByRole("list").getByText(npcName)).toHaveCount(0);
});
