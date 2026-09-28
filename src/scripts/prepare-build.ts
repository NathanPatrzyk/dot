import * as fs from "node:fs/promises";

const clients = {
  cloudflare: "src/adapters/db/client.d1.ts",
  docker: "src/adapters/db/client.sqlite.ts",
} as const;

type AppTarget = keyof typeof clients;

const target = process.env.APP_TARGET as AppTarget | undefined;

if (!target || !(target in clients)) {
  throw new Error("APP_TARGET precisa ser 'cloudflare' ou 'docker'.");
}

await fs.copyFile(clients[target], "src/adapters/db/client.ts");

console.log(`Build preparado para o target: ${target} (${clients[target]})`);
