import { defineConfig } from "astro/config";
import react from "@astrojs/react";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  server: ({ command }) => ({
    port: command === "dev" ? 4321 : 80,
    host: "0.0.0.0",
  }),
});
