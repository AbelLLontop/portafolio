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
