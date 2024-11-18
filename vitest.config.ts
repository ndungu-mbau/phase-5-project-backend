import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    passWithNoTests: true,
    environment: "node",
    dir: "./src",
    reporters: ["verbose"],
    coverage: {
      provider: "c8",
      reportsDirectory: "./src/tests/coverage",
    },
  },
});
