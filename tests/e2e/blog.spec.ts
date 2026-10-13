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

test("la pagina de un post muestra sus tags de tecnologia", async ({ page }) => {
  await page.goto("/blog/desplegar-proyecto-docker-01-dockerizar-app");

  // SPEC.md pide que cada post muestre badges de tecnologia junto a la fecha.
  const tags = page.locator("article > ul li");
  await expect(tags).toHaveCount(4);
  await expect(tags.filter({ hasText: "docker" }).first()).toBeVisible();
});
