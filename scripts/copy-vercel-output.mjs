import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "apps/web/.vercel");
const buildResult = resolve(source, "react-router-build-result.json");
const destination = resolve(root, ".vercel");

if (!existsSync(buildResult)) {
  console.error("No apps/web/.vercel/react-router-build-result.json file was produced by the web build.");
  process.exit(1);
}

rmSync(resolve(root, ".vercel"), { recursive: true, force: true });
mkdirSync(dirname(destination), { recursive: true });
cpSync(source, destination, { recursive: true });

console.log("Copied apps/web/.vercel React Router metadata to .vercel for Vercel.");
