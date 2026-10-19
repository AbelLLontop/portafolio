import { execFileSync } from "node:child_process";
import { chmodSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const hooksDir = path.join(repoRoot, ".githooks");

// Corre como `prepare` en cada `npm install`, asi que tiene que ser inofensivo
// donde no hay repo git: CI y el build de Vercel instalan dependencias sobre un
// checkout sin `.git` (o sin permiso para escribir su config) y `git config`
// ahi aborta la instalacion entera.
if (process.env.CI || !existsSync(path.join(repoRoot, ".git"))) {
  process.exit(0);
}

if (!existsSync(hooksDir)) {
  console.error(`No se encontro ${hooksDir}`);
  process.exit(1);
}

const hooks = readdirSync(hooksDir);

for (const hook of hooks) {
  try {
    chmodSync(path.join(hooksDir, hook), 0o755);
  } catch {
    // En algunos filesystems (ej. Windows sin permisos POSIX) chmod no aplica; no es fatal.
  }
}

execFileSync("git", ["config", "core.hooksPath", ".githooks"], {
  cwd: repoRoot,
  stdio: "inherit",
});

console.log(
  `core.hooksPath configurado a .githooks — hooks activos: ${hooks.join(", ")}.`,
);
