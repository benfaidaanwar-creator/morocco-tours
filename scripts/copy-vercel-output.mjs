import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "apps/web/.vercel/output");
const destination = resolve(root, ".vercel/output");

if (!existsSync(source)) {
  console.error("No apps/web/.vercel/output directory was produced by the web build.");
  process.exit(1);
}

rmSync(resolve(root, ".vercel"), { recursive: true, force: true });
mkdirSync(dirname(destination), { recursive: true });
cpSync(source, destination, { recursive: true });

console.log("Copied apps/web/.vercel/output to .vercel/output for Vercel.");
