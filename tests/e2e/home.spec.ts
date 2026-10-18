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

test("el fondo lo pinta <html>, para no tapar el campo de estrellas", async ({ page }) => {
  await page.goto("/");

  const estilos = await page.evaluate(() => {
    const html = getComputedStyle(document.documentElement);
    const body = getComputedStyle(document.body);
    const canvas = getComputedStyle(document.querySelector("canvas")!);
    return {
      htmlImage: html.backgroundImage,
      htmlColor: html.backgroundColor,
      bodyImage: body.backgroundImage,
      bodyColor: body.backgroundColor,
      canvasZ: canvas.zIndex,
    };
  });

  // El campo de estrellas vive en z-index negativo: en el orden de pintado
  // va despues del fondo del elemento raiz pero ANTES del fondo de un <body>
  // normal, y el degradado del fondo es opaco. Por eso el fondo tiene que
  // estar en <html> y el <body> quedar transparente: con el fondo en <body>
  // las estrellas desaparecen por completo, sin ningun error que lo delate.
  expect(Number(estilos.canvasZ)).toBeLessThan(0);
  expect(estilos.htmlImage).toContain("gradient");
  expect(estilos.htmlColor).not.toBe("rgba(0, 0, 0, 0)");
  expect(estilos.bodyImage).toBe("none");
  expect(estilos.bodyColor).toBe("rgba(0, 0, 0, 0)");
});
