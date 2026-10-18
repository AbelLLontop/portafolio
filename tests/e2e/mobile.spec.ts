import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 375, height: 667 } });

test("viewport mobile no rompe el layout del header", async ({ page }) => {
  await page.goto("/");

  const header = page.getByRole("banner");
  await expect(header).toBeVisible();

  // En mobile la navegacion vive detras del boton de menu: la barra se queda
  // en una sola fila.
  const headerHeight = await header.evaluate(
    (el) => el.getBoundingClientRect().height,
  );
  expect(headerHeight).toBeLessThanOrEqual(72);

  const toggle = header.getByRole("button", { name: "Abrir el menú" });
  await expect(toggle).toBeVisible();
  await toggle.click();

  await expect(header.getByRole("link", { name: "Inicio" })).toBeVisible();
  await expect(header.getByRole("link", { name: "Blog" })).toBeVisible();

  // Abrir el menu no agranda la barra: el panel se superpone.
  const heightOpen = await header.evaluate(
    (el) => el.getBoundingClientRect().height,
  );
  expect(heightOpen).toBeLessThanOrEqual(72);

  const hasHorizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("el menu mobile se cierra con Escape", async ({ page }) => {
  await page.goto("/");

  const header = page.getByRole("banner");
  await header.getByRole("button", { name: "Abrir el menú" }).click();
  await expect(header.getByRole("link", { name: "Blog" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(header.getByRole("link", { name: "Blog" })).toBeHidden();
});
