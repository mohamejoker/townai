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
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-avatar",
          ],
          lucide: ["lucide-react"],
          charts: ["recharts"],
          forms: ["react-hook-form", "@hookform/resolvers"],
          utils: ["clsx", "tailwind-merge", "class-variance-authority"],
          sitebuilder: [
            "./src/components/SiteBuilder/AdvancedSiteBuilder.tsx",
            "./src/components/SiteBuilder/DragDropBuilder.tsx",
            "./src/components/SiteBuilder/ContentEditor.tsx",
            "./src/components/SiteBuilder/StyleEditor.tsx",
            "./src/components/SiteBuilder/PreviewPane.tsx",
            "./src/components/SiteBuilder/TemplateManager.tsx",
            "./src/components/SiteBuilder/AIAssistant.tsx",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}));
