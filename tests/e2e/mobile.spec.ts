import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 375, height: 667 } });

test("viewport mobile no rompe el layout del header", async ({ page }) => {
  await page.goto("/");

  const header = page.getByRole("banner");
  await expect(header).toBeVisible();
  await expect(header.getByRole("link", { name: "Inicio" })).toBeVisible();
  await expect(header.getByRole("link", { name: "Blog" })).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
