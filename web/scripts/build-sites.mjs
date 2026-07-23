import { cp, mkdir, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, "..");
const outputDirectory = resolve(projectDirectory, "out");
const deploymentDirectory = resolve(projectDirectory, "dist");

const build = spawnSync(process.execPath, [resolve(projectDirectory, "node_modules/next/dist/bin/next"), "build"], {
  cwd: projectDirectory,
  env: {
    ...process.env,
    AGENTIC_LAB_SITES_EXPORT: "true"
  },
  stdio: "inherit"
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

await rm(deploymentDirectory, { force: true, recursive: true });
await mkdir(resolve(deploymentDirectory, "client"), { recursive: true });
await mkdir(resolve(deploymentDirectory, "server"), { recursive: true });
await cp(outputDirectory, resolve(deploymentDirectory, "client"), { recursive: true });
await cp(resolve(projectDirectory, "sites/server/index.js"), resolve(deploymentDirectory, "server/index.js"));

console.log(`Sites build prepared at ${deploymentDirectory}`);
