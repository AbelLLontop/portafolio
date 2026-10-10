import { test, expect } from "@playwright/test";

test("home carga y la terminal del hero termina su secuencia sin errores de consola", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  await page.goto("/");

  await expect(page.locator("[data-cycle-count]")).toHaveAttribute(
    "data-cycle-count",
    "1",
    { timeout: 20_000 },
  );

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});
