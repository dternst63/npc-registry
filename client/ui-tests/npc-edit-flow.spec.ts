import { test, expect } from "@playwright/test";

test("Edit NPC flow works", async ({ page }) => {
  await page.goto("/");

  const npcName = `Edit Flow NPC ${Math.random().toString(36).slice(2, 8)}`;
  const originalRole = "Warrior";
  const updatedRole = "Archmage";

  // ---------- CREATE NPC (Seed Step) ----------

  await page.getByTestId("create-npc-btn").click();

  const createModal = page.getByTestId("npc-form-modal");
  await expect(createModal).toBeVisible();

  await createModal.getByLabel("Name").fill(npcName);
  await createModal.getByLabel("Role").fill(originalRole);

  // Intercept CREATE request
  const postPromise = page.waitForRequest(
    (req) => req.method() === "POST" && req.url().includes("/api/npcs"),
  );

  await createModal.getByTestId("form-submit-btn").click();

  // Wait for backend confirmation
  const postRequest = await postPromise;
  const postPayload = JSON.parse(postRequest.postData() || "{}");

  expect(postPayload.name).toBe(npcName);

  // NOW wait for UI render
  // Wait for list refresh
  // Force UI to reload list
  await page.reload();

  // Wait for NPC to appear
  const npcCard = page.getByText(npcName);
  await expect(npcCard).toBeVisible();

  // ---------- EDIT NPC ----------

  // Select NPC first
  await npcCard.click();

  // Click toolbar edit button
  const editBtn = page.getByTestId("edit-npc-btn");
  await expect(editBtn).toBeEnabled();
  await editBtn.click();

  const editModal = page.getByTestId("npc-form-modal");
  await expect(editModal).toBeVisible();

  const roleInput = editModal.getByLabel("Role");
  await roleInput.fill(updatedRole);

  const putPromise = page.waitForRequest(
    (req) => req.method() === "PUT" && req.url().includes("/api/npcs"),
  );

  await editModal.getByTestId("form-submit-btn").click();

  const putRequest = await putPromise;
  const putPayload = JSON.parse(putRequest.postData() || "{}");

  expect(putPayload.role).toBe(updatedRole);

  // ✅ Wait for success state to appear in the UI
  // This could be a success message, or wait for the close button itself
  const closeBtn = editModal.getByRole("button", { name: /close/i });
  await expect(closeBtn).toBeVisible({ timeout: 10000 });

  // Close modal (user action)
  await closeBtn.click();

  // Modal should now disappear
  await expect(editModal).toBeHidden();

  const updatedNpc = page.getByText(updatedRole);
  await expect(updatedNpc).toBeVisible();

});