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

  // La isla es client:visible, asi que hay que esperar a que hidrate ANTES de
  // escribir: si no, React monta con su estado vacio y pisa lo tipeado, el
  // filtro no se aplica nunca y el contador se queda en el total. Astro le
  // saca el atributo `ssr` a la isla justo despues de hidratarla, asi que ese
  // es el momento exacto en que el input ya responde.
  // Se nombra la isla por su componente: filtrar por el input daria dos
  // (ScrollReveal envuelve a BlogList) y el modo estricto se queja.
  const isla = page.locator('astro-island[component-url*="BlogList"]');
  await expect(isla).not.toHaveAttribute("ssr", { timeout: 15000 });

  await input.fill("docker");
  await expect(contador).toContainText(/de \d+ notas/i);
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

test("con el titulo ya pegado, un link del indice no deja el heading tapado", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/blog/desplegar-proyecto-docker-01-dockerizar-app");
  await page.waitForTimeout(500);

  // Se baja primero para que el titulo ya este pegado al momento del clic:
  // ahi el offset del scroll tiene que descontar su alto, no el del nav.
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(500);
  await expect(page.locator(".post-title")).toHaveClass(/is-stuck/);

  const link = page.locator(".toc-link").nth(1);
  const slug = await link.getAttribute("data-slug");
  await link.click();
  await page.waitForTimeout(900);

  const cajas = await page.evaluate((s) => {
    const heading = document.getElementById(s!)!.getBoundingClientRect();
    const titulo = document.querySelector(".post-title")!.getBoundingClientRect();
    return { headingTop: heading.top, tituloBottom: titulo.bottom };
  }, slug);

  expect(
    cajas.headingTop,
    "el heading no deberia quedar detras del titulo pegado",
  ).toBeGreaterThanOrEqual(cajas.tituloBottom);

  // DEUDA CONOCIDA: saltando desde arriba (titulo suelto) el heading si queda
  // tapado. El offset se calcula al hacer clic, cuando el titulo todavia mide
  // su alto grande, y recien despues el salto lo pega y lo encoge; el
  // contenido sube esos ~36px (ver el test de abajo) y el destino se va
  // detras de la banda. Se arregla cuando el encogido deje de mover el flujo.
});

test("el titulo del post se encoge al quedar pegado", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/blog/desplegar-proyecto-docker-01-dockerizar-app");
  await page.waitForTimeout(500);

  // El titulo es el propio elemento sticky: no hay un duplicado aparte.
  const titulo = page.locator(".post-title");
  await expect(titulo).not.toHaveClass(/is-stuck/);

  // Alto del titulo y posicion del cuerpo DENTRO del documento (no en el
  // viewport): juntos dicen si el encogido movio el flujo.
  const medir = () =>
    page.evaluate(() => {
      const t = document.querySelector(".post-title")!;
      const cuerpo = document.querySelector(".prose-post-body")!;
      return {
        altoTitulo: t.getBoundingClientRect().height,
        cuerpoEnDoc: cuerpo.getBoundingClientRect().top + window.scrollY,
      };
    });

  const antes = await medir();

  // Scroll pasando el titulo grande: queda pegado y se encoge.
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(500);
  await expect(titulo).toHaveClass(/is-stuck/);

  const pegado = await medir();
  expect(pegado.altoTitulo).toBeLessThan(antes.altoTitulo);

  // DEUDA CONOCIDA: el titulo es `position: sticky`, asi que sigue ocupando
  // su lugar en el flujo, y al encogerse arrastra hacia arriba todo lo que
  // viene despues. Se afirma la relacion exacta (el contenido sube justo lo
  // que el titulo se encogio) en vez de un numero fijo: asi el test sigue
  // siendo util si alguien cambia el tamanio de la banda, y falla si el
  // corrimiento deja de ser solo eso. Lo correcto seria que no se moviera
  // nada: reservar el hueco del titulo para que el encogido no reflue.
  const encogido = antes.altoTitulo - pegado.altoTitulo;
  const corrimiento = antes.cuerpoEnDoc - pegado.cuerpoEnDoc;
  expect(corrimiento).toBeCloseTo(encogido, 0);

  // En desktop la banda cae exactamente sobre la columna del post, sin
  // estirarse a todo el viewport (taparia la decoracion del fondo a los
  // costados).
  const cajas = await page.evaluate(() => {
    const r = (s: string) => {
      const b = document.querySelector(s)!.getBoundingClientRect();
      return { left: Math.round(b.left), right: Math.round(b.right) };
    };
    return { titulo: r(".post-title"), articulo: r("article"), viewport: window.innerWidth };
  });

  expect(cajas.titulo).toEqual(cajas.articulo);
  expect(cajas.titulo.right).toBeLessThan(cajas.viewport - 100);

  // El numero de nota solo se muestra con el titulo encogido.
  await expect(page.locator(".post-title-number")).toHaveText(/^#\d+$/);

  // Y al volver arriba se despega y el flujo vuelve exactamente a su sitio:
  // el corrimiento es reversible, no acumulativo.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await expect(titulo).not.toHaveClass(/is-stuck/);

  const devuelta = await medir();
  expect(devuelta.altoTitulo).toBeCloseTo(antes.altoTitulo, 0);
  expect(devuelta.cuerpoEnDoc).toBeCloseTo(antes.cuerpoEnDoc, 0);
});
