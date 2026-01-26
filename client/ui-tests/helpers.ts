import { Page, expect } from "@playwright/test";

export async function createNpc(page: Page, name: string) {
  await page.goto("/");

  await page.waitForLoadState("networkidle");
  await page.waitForSelector('[data-testid="create-npc-btn"]');

  await page.getByTestId("create-npc-btn").click();

  const modal = page.getByTestId("npc-form-modal");
  await modal.waitFor({ state: "visible" });

  await modal.getByLabel("Name").fill(name);
  await modal.getByLabel("Race").fill("Human");
  await modal.getByLabel("Role").fill("Fighter");

  await modal.getByRole("button", { name: /save/i }).click();

  await modal.getByTestId("modal-close").click();

  await expect(modal).toBeHidden();
  await expect(page.getByText(name)).toBeVisible();
}
