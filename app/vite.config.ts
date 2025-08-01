import { defineConfig } from "vite";
import { InVite } from "@inspatial/run/hot";
import tailwindcss from "@tailwindcss/vite";
import deno from "@deno/vite-plugin";

export default defineConfig({
  server: {
    port: 6310,
  },
  esbuild: {
    jsxFactory: "R.c",
    jsxFragment: "R.f",
  },
  plugins: [deno(), InVite(), tailwindcss()],
  build: {
    target: "esnext",
  },
});
