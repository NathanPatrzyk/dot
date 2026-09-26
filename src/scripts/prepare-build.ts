import * as fs from "node:fs/promises";

const target = process.env.APP_TARGET;

if (target !== "cloudflare" && target !== "docker") {
  throw new Error("APP_TARGET precisa ser 'cloudflare' ou 'docker'.");
}

await fs.copyFile(`src/adapters-index-${target}.ts`, "src/adapters/index.ts");

console.log(`Build preparado para o target: ${target}`);
