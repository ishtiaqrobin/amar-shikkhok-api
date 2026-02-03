import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  platform: "node",
  target: "node20",
  outDir: "api",
  external: ["pg-native", "@prisma/client", "@prisma/adapter-pg"], // Prisma remains external to load engines correctly
  noExternal: ["better-auth"], // Bundle better-auth to resolve its dynamic requires at build time
  skipNodeModulesBundle: false,
  shims: true,
  outExtension() {
    return { js: ".mjs" };
  },
  clean: true,
});
