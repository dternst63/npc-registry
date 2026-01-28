import { test, expect } from "@playwright/test";

test("Edit NPC flow works", async ({ page }) => {
  const npcName = `Edit Flow NPC ${Math.random().toString(36).slice(2, 8)}`;
  const originalRole = "Warrior";
  const updatedRole = "Archmage";

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

    // UPDATE
    if (method === "PUT") {
      const body = JSON.parse(req.postData() || "{}");

      let updatedNpc;

      npcStore = npcStore.map((npc) => {
        if (npc.id === "123") {
          updatedNpc = { ...npc, ...body };
          return updatedNpc;
        }
        return npc;
      });

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(updatedNpc),
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
  await createModal.getByLabel("Role").fill(originalRole);

  await createModal.getByTestId("form-submit-btn").click();

  const closeBtn = createModal.getByRole("button", { name: /close/i });
  await expect(closeBtn).toBeVisible();

  // ---- Close modal manually ----
  await closeBtn.click();

  // Wait for modal to close naturally
  await expect(createModal).toBeHidden();

  // ---------- VERIFY NPC APPEARS ----------

  const npcCard = page.getByRole("list").getByText(npcName);
  await expect(npcCard).toBeVisible();

  // ---------- EDIT NPC ----------

  await npcCard.click();

  const editBtn = page.getByTestId("edit-npc-btn");
  await expect(editBtn).toBeEnabled();
  await editBtn.click();

  const editModal = page.getByTestId("npc-form-modal");
  await expect(editModal).toBeVisible();

  const roleInput = editModal.getByLabel("Role");
  await roleInput.fill(updatedRole);

  await editModal.getByTestId("form-submit-btn").click();

  await page.waitForTimeout(5000);
  const closeEditBtn = editModal.getByRole("button", { name: /close/i });
  await expect(closeEditBtn).toBeVisible();

  await closeEditBtn.click();

  await expect(editModal).toBeHidden();

  // ---------- VERIFY UPDATE ----------

  await expect(page.getByText(updatedRole)).toBeVisible();
});
