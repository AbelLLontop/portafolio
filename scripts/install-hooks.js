import { execFileSync } from "node:child_process";
import { chmodSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hookPath = path.join(repoRoot, ".githooks", "commit-msg");

if (!existsSync(hookPath)) {
  console.error(`No se encontro ${hookPath}`);
  process.exit(1);
}

try {
  chmodSync(hookPath, 0o755);
} catch {
  // En algunos filesystems (ej. Windows sin permisos POSIX) chmod no aplica; no es fatal.
}

execFileSync("git", ["config", "core.hooksPath", ".githooks"], {
  cwd: repoRoot,
  stdio: "inherit",
});

console.log("core.hooksPath configurado a .githooks — commit-msg activo.");
