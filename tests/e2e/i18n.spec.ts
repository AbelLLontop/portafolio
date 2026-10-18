import { test, expect } from "@playwright/test";

const POST = "desplegar-proyecto-docker-01-dockerizar-app";

test("el español no lleva prefijo y el inglés vive bajo /en/", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");

  await page.goto("/en/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  // Los slugs se traducen: /sobre-mi en español, /en/about en inglés.
  await page.goto("/en/about");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  // Por su clase y no por `h1`: el dev toolbar de Astro agrega sus propios
  // h1 y getByRole los alcanza atravesando el shadow DOM.
  await expect(page.locator("h1.about-headline")).toContainText("Abel Llontop");

  await page.goto("/sobre-mi");
  await expect(page.locator("h1.about-headline")).toContainText("Soy Abel Llontop");
});

test("el navbar y el pie quedan en inglés bajo /en/", async ({ page }) => {
  await page.goto("/en/");

  const nav = page.locator("header nav").first();
  await expect(nav.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "About" })).toBeVisible();

  // Los links apuntan a las rutas inglesas, no a las españolas.
  await expect(nav.getByRole("link", { name: "About" })).toHaveAttribute("href", "/en/about");
  await expect(page.locator("footer").getByRole("link", { name: "Home" })).toHaveAttribute(
    "href",
    "/en/",
  );
});

test("el botón de idioma cambia de idioma sin perder la página", async ({ page }) => {
  // El caso que importa: leyendo una nota, cambiar de idioma tiene que caer en
  // ESA nota traducida, no en el inicio.
  await page.goto(`/blog/${POST}`);

  // El enlace se nombra en el idioma DESTINO ("English" también leído desde
  // el español), que es la convención para un selector de idioma.
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(`/en/blog/${POST}`);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  // Y la vuelta.
  await page.getByRole("link", { name: "Español", exact: true }).click();
  await expect(page).toHaveURL(`/blog/${POST}`);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});

test("el idioma activo se marca y no es un link", async ({ page }) => {
  await page.goto("/en/");

  // Acotado al switch del header: el del panel mobile también existe en el
  // DOM (oculto) y un selector CSS no distingue.
  const activo = page.locator(".lang-switch-desktop [aria-current='true']");
  await expect(activo).toHaveText("EN");
  // El activo es un <span>: no tiene sentido linkear a donde ya estás.
  await expect(page.getByRole("link", { name: "English", exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Español", exact: true })).toHaveAttribute(
    "href",
    "/",
  );
});

test("cada página declara los alternates de los dos idiomas", async ({ page }) => {
  // Se afirman los PATHS, no las URLs absolutas: el dev server resuelve sobre
  // localhost y sin barra final, mientras el build usa `site` y la agrega. Que
  // el autorreferente coincida EXACTO con el canonical (barra incluida, o
  // Google descarta el grupo entero) se verifica sobre el build, en `dist/`.
  for (const [url, selfPath] of [
    ["/blog", "/blog/"],
    ["/en/blog", "/en/blog/"],
  ] as const) {
    await page.goto(url);

    const href = async (hreflang: string) =>
      new URL(
        (await page
          .locator(`link[rel="alternate"][hreflang="${hreflang}"]`)
          .getAttribute("href")) ?? "",
      ).pathname;

    expect(await href("es")).toBe("/blog/");
    expect(await href("en")).toBe("/en/blog/");
    expect(await href("x-default")).toBe("/blog/");

    // El autorreferente apunta a la propia página, no a la otra versión.
    expect(await href(url.startsWith("/en") ? "en" : "es")).toBe(selfPath);
  }
});

test("el listado inglés traduce el buscador y avisa que las notas están en español", async ({
  page,
}) => {
  await page.goto("/en/blog");

  await expect(page.locator("main")).toContainText("Technical notes");
  await expect(page.locator("main")).toContainText(/notes are written in Spanish/i);

  const input = page.getByPlaceholder(/search by/);
  // Por su aria-live: el aviso de idioma comparte la clase .font-mono.
  const contador = page.locator("main p[aria-live='polite']");

  // Igual que en el listado español: hay que esperar la hidratacion antes de
  // escribir, o React monta con su estado vacio y pisa lo tipeado.
  await expect(page.locator('astro-island[component-url*="BlogList"]')).not.toHaveAttribute(
    "ssr",
    { timeout: 15000 },
  );

  await input.fill("docker");
  await expect(contador).toContainText(/\d+ of \d+ notes/i);

  await input.fill("999");
  await expect(page.locator("main").getByText(/no notes matched/i)).toBeVisible();
});

test("el listado español no muestra ningún aviso de idioma", async ({ page }) => {
  await page.goto("/blog");

  const main = page.locator("main");
  await expect(main).toContainText("Notas técnicas");
  await expect(main.getByText(/están escritas en español/i)).toHaveCount(0);
  await expect(main.getByText(/written in Spanish/i)).toHaveCount(0);
});

test("una nota lleva el mismo #N en los dos idiomas", async ({ page }) => {
  await page.goto(`/blog/${POST}`);
  const numeroEs = await page.locator(".post-title-number").textContent();
  await expect(page.locator("main")).toContainText("Nota #");

  await page.goto(`/en/blog/${POST}`);
  const numeroEn = await page.locator(".post-title-number").textContent();
  await expect(page.locator("main")).toContainText("Note #");

  // La numeracion sale de lib/posts.ts, compartida: no puede divergir.
  expect(numeroEn).toBe(numeroEs);
  expect(numeroEs).toMatch(/^#\d+$/);
});

test("la nota en inglés traduce el chrome y avisa que el texto está en español", async ({
  page,
}) => {
  await page.goto(`/en/blog/${POST}`);

  await expect(page.locator("main")).toContainText(/this note is written in spanish/i);
  await expect(page.getByRole("link", { name: /back to the notes/i })).toHaveAttribute(
    "href",
    "/en/blog",
  );

  // El boton de copiar y el indice tambien salen del diccionario.
  await expect(page.locator(".code-copy").first()).toHaveAttribute("data-tip", "Copy");
  await expect(page.locator(".toc")).toContainText("In this post");
});

test("la consola inglesa acepta los comandos traducidos", async ({ page }) => {
  await page.goto("/en/");

  await expect(page.getByLabel("Console")).toBeVisible();

  // El inicio no tiene <main>: la consola se ubica por su propio hook.
  const consola = page.locator("[data-cycle-count]");
  await expect(consola).toContainText("abel llontop · console");

  // `projects` existe en inglés; el botón se habilita cuando la consola
  // termina el diálogo de apertura, así que el click espera solo.
  await page.getByRole("button", { name: "projects", exact: true }).click();
  await expect(consola).toContainText("published", { timeout: 20000 });

  // Y `proyectos` ya no: es el nombre español del comando.
  const input = page.getByLabel("Console");
  await input.fill("proyectos");
  await input.press("Enter");
  await expect(consola).toContainText(/don.t know the command/i, { timeout: 20000 });
});

test("cambiar de idioma no vuelve a animar la página", async ({ page }) => {
  await page.goto("/");
  // Se espera a que la consola termine su diálogo de apertura, para no
  // confundir el estado inicial con el que llega tras el cambio.
  await expect(page.locator("[data-cycle-count='1']")).toBeVisible({ timeout: 20000 });

  await page.getByRole("link", { name: "English", exact: true }).click();
  await page.waitForURL("/en/");

  // La marca la pone un script inline del <head>, antes del primer pintado.
  await expect(page.locator("html")).toHaveClass(/instant-nav/);

  // La consola llega con el diálogo ya escrito: `data-cycle-count` pasa a 1
  // apenas hidrata, en vez de después de varios segundos de tecleo.
  await expect(page.locator("[data-cycle-count='1']")).toBeVisible({ timeout: 2000 });
  await expect(page.locator("[data-cycle-count]")).toContainText("I am Abel Llontop");

  // Y las secciones llegan en su estado final en vez de revelarse. La primera
  // está bajo el pliegue: en una carga normal seguiría en opacity 0.
  const opacidad = await page
    .locator("[data-reveal]")
    .first()
    .evaluate((el) => getComputedStyle(el).opacity);
  expect(opacidad).toBe("1");
});

test("una navegación normal sí anima", async ({ page }) => {
  // El "sin animación" es solo para el cambio de idioma: el resto del sitio
  // conserva sus revelados.
  await page.goto("/");
  // Desde el header: el pie también tiene un enlace "Blog".
  await page.locator("header nav").first().getByRole("link", { name: "Blog" }).click();
  await page.waitForURL("/blog");

  await expect(page.locator("html")).not.toHaveClass(/instant-nav/);
});

test("el menú hamburguesa en inglés incluye el cambio de idioma", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/en/");

  const toggle = page.getByRole("button", { name: "Open menu" });
  await expect(toggle).toBeVisible();
  await toggle.click();

  const panel = page.locator("#nav-mobile");
  await expect(panel.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/en/blog");
  await expect(panel.getByRole("link", { name: /Español/ })).toHaveAttribute("href", "/");

  // El aria-label tambien se traduce al abrir.
  await expect(page.getByRole("button", { name: "Close menu" })).toBeVisible();
});
