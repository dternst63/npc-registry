import { test, expect } from "@playwright/test";

test("Delete NPC flow works", async ({ page }) => {
  const npcName = `Delete Flow NPC ${Date.now()}`;

  // ---- In-memory mock DB ----
  let npcStore: any[] = [];

  // ---- API Mock Handler ----
  const handleNpcRoute = async (route) => {
    const req = route.request();
    const method = req.method();

    // CREATE
    if (method === "POST") {
      const body = JSON.parse(req.postData() || "{}");

      const newNpc = {
        id: "123",
        name: body.name,
        role: body.role,
      };

      npcStore.push(newNpc);

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(newNpc),
      });
      return;
    }

    // FETCH LIST
    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(npcStore),
      });
      return;
    }

    // DELETE
    if (method === "DELETE") {
      npcStore = [];

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
      return;
    }

    await route.continue();
  };

  // ---- Register Routes ----
  await page.route("**/api/npcs", handleNpcRoute);
  await page.route("**/api/npcs/**", handleNpcRoute);

  // ---------- START TEST ----------

  await page.goto("/");

  // ---------- CREATE NPC ----------

  await page.getByTestId("create-npc-btn").click();

  const createModal = page.getByTestId("npc-form-modal");
  await expect(createModal).toBeVisible();

  await createModal.getByLabel("Name").fill(npcName);
  await createModal.getByLabel("Role").fill("Guard");

  await createModal.getByTestId("form-submit-btn").click();

  const closeBtn = createModal.getByRole("button", { name: /close/i });
  await expect(closeBtn).toBeVisible();

  // ---- Close modal manually ----
  await closeBtn.click();

  // Wait for modal to close naturally
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

  const confirmModal = page.getByRole("dialog");
  await expect(confirmModal).toBeVisible();

  await confirmModal.getByRole("button", { name: /^delete$/i }).click();
  await confirmModal.getByRole("button", { name: /^close$/i }).click();

  // Modal should close after success
  await expect(confirmModal).toBeHidden();

  // ---------- VERIFY NPC REMOVED ----------

  await expect(page.getByRole("list")).not.toContainText(npcName);
});
