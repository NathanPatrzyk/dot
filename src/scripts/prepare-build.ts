import * as fs from "fs/promises";

const target = process.env.APP_TARGET;

if (target !== "cloudflare" && target !== "homelab") {
  throw new Error("APP_TARGET precisa ser 'cloudflare' ou 'homelab'.");
}

await fs.copyFile(`src/adapters-index-${target}.ts`, "src/adapters/index.ts");

console.log(`Build preparado para o target: ${target}`);
