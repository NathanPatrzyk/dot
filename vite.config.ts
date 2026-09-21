import { defineConfig } from "vite";

import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";

import { cdnAdapter } from "@vinext/cloudflare/cache/cdn-adapter";

const isNode = process.env.RUNTIME === "node";

export default defineConfig({
  plugins: [
    vinext({
      cache: {
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
