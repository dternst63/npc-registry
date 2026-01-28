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

  const postResponse = page.waitForResponse(resp =>
    resp.request().method() === "POST" &&
    resp.url().endsWith("/api/npcs") &&
    resp.status() === 200,
  );

  await createModal.getByTestId("form-submit-btn").click();
  await postResponse;

  const createCloseBtn = createModal.getByRole("button", { name: /close/i });
  await expect(createCloseBtn).toBeEnabled();
  await createCloseBtn.click();

  await expect(createModal).toBeHidden();

  // --------------------
  // SELECT
  // --------------------

  const npcItem = page.getByRole("list").getByText(npcName);

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

  const putResponse = page.waitForResponse(resp =>
    resp.request().method() === "PUT" &&
    /\/api\/npcs\/[^/]+$/.test(resp.url()) &&
    resp.status() === 200,
  );

  await editModal.getByTestId("form-submit-btn").click();
  await putResponse;

  const editCloseBtn = editModal.getByRole("button", { name: /close/i });
  await expect(editCloseBtn).toBeEnabled();
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

  const deleteResponse = page.waitForResponse(resp =>
    resp.request().method() === "DELETE" &&
    /\/api\/npcs\/[^/]+$/.test(resp.url()) &&
    resp.status() === 200,
  );

  const confirmDeleteBtn = confirmModal.getByRole("button", {
    name: /^delete$/i,
  });

  await confirmDeleteBtn.click();
  await deleteResponse;

  const deleteCloseBtn = confirmModal.getByRole("button", { name: /close/i });
  await expect(deleteCloseBtn).toBeEnabled();
  await deleteCloseBtn.click();

  await expect(confirmModal).toBeHidden();

  // --------------------
  // VERIFY REMOVAL
  // --------------------

  await expect(
    page.getByRole("list").getByText(npcName),
  ).toHaveCount(0);
});
