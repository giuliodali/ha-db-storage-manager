import { defineConfig } from "vite";
export default defineConfig({
  define: { "process.env.NODE_ENV": "\"production\"" },
  build: {
    outDir: "../custom_components/db_storage_manager/frontend",
    emptyOutDir: false,
    minify: true,
    lib: { entry: "src/main.js", formats: ["es"], fileName: () => "db-storage-panel.js" },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
