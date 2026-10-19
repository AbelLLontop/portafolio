/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// `getViteConfig` reusa la config de Astro, asi que los tests resuelven los
// mismos alias e imports que el sitio (incluido `astro:content`, que en los
// tests se reemplaza con vi.mock).
export default getViteConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
