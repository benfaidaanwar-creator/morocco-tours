import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const webVercelDir = resolve(root, "apps/web/.vercel");
const webBuildDir = resolve(root, "apps/web/build");
const buildResult = resolve(webVercelDir, "react-router-build-result.json");
const rootVercelDir = resolve(root, ".vercel");
const rootBuildDir = resolve(root, "build");

if (!existsSync(buildResult)) {
  console.error("No apps/web/.vercel/react-router-build-result.json file was produced by the web build.");
  process.exit(1);
}

if (!existsSync(webBuildDir)) {
  console.error("No apps/web/build directory was produced by the web build.");
  process.exit(1);
}

rmSync(rootVercelDir, { recursive: true, force: true });
rmSync(rootBuildDir, { recursive: true, force: true });
mkdirSync(dirname(rootVercelDir), { recursive: true });
cpSync(webVercelDir, rootVercelDir, { recursive: true });
cpSync(webBuildDir, rootBuildDir, { recursive: true });

console.log("Copied apps/web React Router build artifacts to the repository root for Vercel.");
