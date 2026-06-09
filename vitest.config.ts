import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    // .tsx (コンポーネント) は jsdom、それ以外 (純ロジック/db) は node
    environmentMatchGlobs: [
      ["**/*.test.tsx", "happy-dom"],
    ],
    environment: "node",
  },
});
