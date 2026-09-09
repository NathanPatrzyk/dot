import { defineConfig } from "vite";

import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";

import { kvDataAdapter } from "@vinext/cloudflare/cache/kv-data-adapter";
import { cdnAdapter } from "@vinext/cloudflare/cache/cdn-adapter";

const isNode = process.env.RUNTIME === "node";

export default defineConfig({
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
