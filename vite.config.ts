import { defineConfig } from "vite";
import { resolve } from "node:path";

import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";

import { kvDataAdapter } from "@vinext/cloudflare/cache/kv-data-adapter";
import { cdnAdapter } from "@vinext/cloudflare/cache/cdn-adapter";

const root = process.cwd();

const sqliteClient = resolve(root, "src/adapters/sqlite/client.ts");

const d1Client = resolve(root, "src/adapters/cloudflare/d1/client.ts");

const isNode = process.env.RUNTIME === "node";

export default defineConfig({
  resolve: {
    alias: {
      "@/db/client": isNode ? sqliteClient : d1Client,
    },
  },

  plugins: [
    vinext({
      cache: {
        data: kvDataAdapter(),
        cdn: cdnAdapter(),
      },
    }),

    ...(!isNode
      ? [
          cloudflare({
            viteEnvironment: {
              name: "rsc",
              childEnvironments: ["ssr"],
            },
          }),
        ]
      : []),
  ],
});
