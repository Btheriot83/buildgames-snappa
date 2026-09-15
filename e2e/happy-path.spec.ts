import { test, expect } from "@playwright/test";

test("first-visit template → canvas → export controls", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("template-gallery")).toBeVisible({
    timeout: 30000,
  });
  await expect(
    page.getByRole("heading", { name: /Compose\. Export/i })
  ).toBeVisible();
  await expect(page.getByTestId("materials-tape")).toContainText(/Fixed size/i);

  await page.getByTestId("template-launch-poster").click();
  await expect(page.getByTestId("template-gallery")).toBeHidden({
    timeout: 10000,
  });

  await expect(page.getByTestId("design-canvas")).toBeVisible();
  await expect(page.getByTestId("layers-list")).toContainText(/text|image|rect/i);

  await expect(page.getByTestId("export-svg")).toBeVisible();
  await expect(page.getByTestId("export-pdf")).toBeVisible();
  await expect(page.getByTestId("export-dock")).toBeVisible();
  await expect(page.getByTestId("ink-drops")).toContainText(/ink/i);

  await expect(page.getByTestId("status-bar")).toBeVisible();
});
