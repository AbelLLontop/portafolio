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

test("el post arma la barra de codigo con boton de icono y enmarca las tablas", async ({
  page,
}) => {
  await page.goto("/blog/desplegar-proyecto-docker-02-recursos-y-github");

  const bloque = page.locator(".code-block").first();
  await expect(bloque).toBeVisible();
  await expect(bloque.locator(".code-lang")).not.toBeEmpty();

  // El boton es solo icono: el texto vive en el globo (data-tip), no dentro.
  const copiar = bloque.locator(".code-copy");
  await expect(copiar).toHaveText("");
  await expect(copiar).toHaveAttribute("data-tip", "Copiar");
  await expect(copiar.locator("svg")).toHaveCount(2);

  // Toda tabla queda dentro de su marco con scroll propio.
  const tablas = await page.locator("table").count();
  expect(tablas).toBeGreaterThan(0);
  await expect(page.locator(".table-wrap > table")).toHaveCount(tablas);
});

test("el indice marca la ultima seccion y su linea termina en el item activo", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/blog/desplegar-proyecto-docker-01-dockerizar-app");
  await page.waitForTimeout(500);

  const items = page.locator(".toc-link");
  const ultimo = items.last();

  // Al fondo de la pagina la ultima seccion queda marcada: su heading nunca
  // llega al umbral porque abajo no hay una pantalla entera de contenido.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(500);
  await expect(ultimo).toHaveClass(/is-active/);

  // La linea del indice mide lo mismo que el pip, asi que llega justo hasta el.
  for (const fraccion of [0.3, 0.6, 1]) {
    await page.evaluate((f) => {
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, Math.round(alto * f));
    }, fraccion);
    await page.waitForTimeout(400);

    const desfase = await page.evaluate(() => {
      const toc = document.querySelector(".toc")!;
      const activo = document.querySelector(".toc-link.is-active");
      if (!activo) return null;
      const relleno = parseFloat(getComputedStyle(toc).getPropertyValue("--toc-fill"));
      const punta = toc.getBoundingClientRect().top + relleno;
      const pip = activo.getBoundingClientRect();
      return Math.abs(punta - (pip.top + pip.height / 2));
    });

    expect(desfase, `a ${fraccion * 100}% la punta deberia caer sobre el pip`).toBeLessThan(2);
  }
});

test("la barra compacta del post aparece sin mover el contenido", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/blog/desplegar-proyecto-docker-01-dockerizar-app");
  await page.waitForTimeout(500);

  const barra = page.locator(".post-bar");
  await expect(barra).not.toHaveClass(/is-visible/);

  // Posicion del cuerpo del post dentro del documento, no en el viewport: es
  // lo que se movia cuando el header encogia y tapaba el texto.
  const posicion = () =>
    page.evaluate(() => {
      const cuerpo = document.querySelector(".prose-post-body")!;
      return cuerpo.getBoundingClientRect().top + window.scrollY;
    });

  const antes = await posicion();

  // Scroll pasando el titulo grande: la barra entra en su lugar.
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(500);
  await expect(barra).toHaveClass(/is-visible/);
  expect(await posicion()).toBeCloseTo(antes, 0);

  // En desktop la caja cae exactamente sobre la columna del post: mismos
  // bordes que el titulo real, sin estirarse a todo el viewport (taparia la
  // decoracion del fondo a los costados).
  const cajas = await page.evaluate(() => {
    const r = (s: string) => {
      const b = document.querySelector(s)!.getBoundingClientRect();
      return { left: Math.round(b.left), right: Math.round(b.right) };
    };
    return { panel: r(".post-bar-panel"), articulo: r("article"), viewport: window.innerWidth };
  });

  expect(cajas.panel).toEqual(cajas.articulo);
  expect(cajas.panel.right).toBeLessThan(cajas.viewport - 100);

  // Y al volver arriba se va, tambien sin desplazar nada.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await expect(barra).not.toHaveClass(/is-visible/);
  expect(await posicion()).toBeCloseTo(antes, 0);
});
