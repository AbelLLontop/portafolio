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

  // Mientras el dialogo de apertura escribe, la consola esta bloqueada: si no,
  // un comando se intercala encima y las lineas se entreveran.
  const consola = page.getByLabel("Consola");
  const pill = page.getByRole("button", { name: "help", exact: true });
  await expect(consola).toBeDisabled();
  await expect(pill).toBeDisabled();

  await expect(page.locator("[data-cycle-count]")).toHaveAttribute(
    "data-cycle-count",
    "1",
    { timeout: 30_000 },
  );

  await expect(consola).toBeEnabled();
  await expect(pill).toBeEnabled();

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});
