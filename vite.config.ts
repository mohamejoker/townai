import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control",
    },
    watch: {
      // Exclude the supabase directory from being watched to prevent EMFILE errors
      ignored: ["**/supabase/**"],
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: ["@vite/client", "@vite/env"],
  },
  esbuild: {
    target: "es2019",
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core vendor libs
          if (id.includes("react") || id.includes("react-dom")) {
            return "vendor-react";
          }
          // UI component libraries
          if (id.includes("@radix-ui") || id.includes("lucide-react")) {
            return "vendor-ui";
          }
          // Charts and visualization
          if (id.includes("recharts") || id.includes("chart")) {
            return "vendor-charts";
          }
          // Admin related components
          if (
            id.includes("src/components/Admin") ||
            id.includes("src/pages/admin")
          ) {
            return "admin";
          }
          // Services and utilities
          if (id.includes("src/services") || id.includes("src/utils")) {
            return "services";
          }
          // Other vendor dependencies
          if (id.includes("node_modules")) {
            return "vendor-misc";
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
    minify: "esbuild",
    target: "es2020",
  },
}));
