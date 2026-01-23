import { test, expect } from "@playwright/test";

test("NPC full lifecycle flow works", async ({ page }) => {
  await page.goto("/");

  const npcName = `Smoke NPC ${Date.now()}`;
  const updatedRole = "Commander";

  // --------------------
  // CREATE
  // --------------------

  await page.getByTestId("create-npc-btn").click();

  const createModal = page.getByTestId("npc-form-modal");
  await expect(createModal).toBeVisible();

  await createModal.getByLabel("Name").fill(npcName);
  await createModal.getByLabel("Role").fill("Scout");

  const postPromise = page.waitForRequest(req =>
    req.method() === "POST" && req.url().includes("/api/npcs"),
  );

  await createModal.getByTestId("form-submit-btn").click();
  await postPromise;

  const createCloseBtn = createModal.getByRole("button", { name: /close/i });
  await createCloseBtn.click();

  await expect(createModal).toBeHidden();

  // --------------------
  // SELECT
  // --------------------

  const npcItem = page
    .getByRole("list")
    .getByText(npcName);

  await expect(npcItem).toBeVisible();
  await npcItem.click();

  // --------------------
  // EDIT
  // --------------------

  const editBtn = page.getByTestId("edit-npc-btn");
  await expect(editBtn).toBeEnabled();
  await editBtn.click();

  const editModal = page.getByTestId("npc-form-modal");
  await expect(editModal).toBeVisible();

  const roleInput = editModal.getByLabel("Role");
  await roleInput.fill(updatedRole);

  const putPromise = page.waitForRequest(req =>
    req.method() === "PUT" && req.url().includes("/api/npcs"),
  );

  await editModal.getByTestId("form-submit-btn").click();
  await putPromise;

  const editCloseBtn = editModal.getByRole("button", { name: /close/i });
  await editCloseBtn.click();

  await expect(editModal).toBeHidden();

  // --------------------
  // DELETE
  // --------------------

  const deleteBtn = page.getByTestId("delete-npc-btn");
  await expect(deleteBtn).toBeEnabled();
  await deleteBtn.click();

  const confirmModal = page.getByRole("dialog");
  await expect(confirmModal).toBeVisible();

  const deletePromise = page.waitForRequest(req =>
    req.method() === "DELETE" && req.url().includes("/api/npcs"),
  );

  const confirmDeleteBtn = confirmModal.getByRole("button", { name: /^delete$/i });
  await confirmDeleteBtn.click();

  await deletePromise;

  const deleteCloseBtn = confirmModal.getByRole("button", { name: /close/i });
  await deleteCloseBtn.click();

  await expect(confirmModal).toBeHidden();

  // Verify removed from list
  await expect(
    page.getByRole("list").getByText(npcName),
  ).toHaveCount(0);
});
