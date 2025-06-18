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
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor";
            }
            if (id.includes("@radix-ui")) {
              return "ui";
            }
            if (id.includes("lucide-react")) {
              return "lucide";
            }
            if (id.includes("recharts")) {
              return "charts";
            }
            if (id.includes("react-hook-form") || id.includes("@hookform")) {
              return "forms";
            }
            if (
              id.includes("clsx") ||
              id.includes("tailwind-merge") ||
              id.includes("class-variance-authority")
            ) {
              return "utils";
            }
            return "vendor";
          }
          if (id.includes("SiteBuilder")) {
            return "sitebuilder";
          }
          if (id.includes("Admin") && !id.includes("pages")) {
            return "admin-components";
          }
          if (id.includes("pages/admin")) {
            return "admin-pages";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}));
