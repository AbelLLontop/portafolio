import { test, expect } from "@playwright/test";

test("listado de blog muestra posts y ningun link lleva a un 404", async ({
  page,
}) => {
  await page.goto("/blog");

  const hrefs = await page.locator("a[href^='/blog/']").evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")!).filter((href) => href !== "/blog"),
  );

  expect(hrefs.length).toBeGreaterThan(0);

  for (const href of hrefs) {
    const response = await page.request.get(href);
    expect(response.status(), `${href} no deberia responder 404`).toBe(200);
  }
});

test("el buscador filtra por numero de nota y por texto", async ({ page }) => {
  await page.goto("/blog");

  const input = page.getByPlaceholder(/buscar por/);
  const contador = page.locator("main p.font-mono").first();
  const filas = page.locator("a[href^='/blog/']");

  // la isla es client:visible, el primer filtro espera a que hidrate
  await input.fill("docker");
  await expect(contador).toContainText(/de \d+ notas/i, { timeout: 15000 });
  expect(await filas.count()).toBeGreaterThan(0);

  // un numero exacto devuelve esa sola nota, no los titulos que lo contengan
  await input.fill("2");
  await expect(filas).toHaveCount(1);
  await expect(filas.first()).toContainText("#2");

  // tambien con el # que se ve en la fila
  await input.fill("#2");
  await expect(filas).toHaveCount(1);
  await expect(filas.first()).toContainText("#2");

  // un numero que no existe cae en el estado vacio
  await input.fill("999");
  await expect(filas).toHaveCount(0);
  await expect(page.getByText(/no se encontraron notas/i)).toBeVisible();
});
